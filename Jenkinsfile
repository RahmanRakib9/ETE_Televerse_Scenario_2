pipeline {
  agent any

  environment {
    IMAGE_NAME = "demo-ci-cd"                       // image base name
    CONTAINER_NAME = "demo_ci_cd_app"               // used by docker-compose
    APP_PORT = "3000"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        // Install all deps including devDeps to run tests
        sh 'npm ci'
        sh 'npm test'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: '**/test-results.xml' // optional if you produce junit files
        }
      }
    }

    stage('Build Docker image') {
      steps {
        // build docker image with tag including build number and branch
        script {
          def tag = "${env.BUILD_ID}"
          env.IMAGE_TAG = "${IMAGE_NAME}:${tag}"
        }
        sh '''
          docker build -t ${IMAGE_TAG} .
          docker images | grep ${IMAGE_NAME} || true
        '''
      }
    }

    stage('Deploy (docker-compose)') {
      steps {
        // bring up container with docker-compose (rebuild is safe)
        sh '''
          docker-compose down || true
          docker-compose up -d --build
        '''
      }
    }

    stage('Verify container health') {
      steps {
        // Wait for container health status to be "healthy" or curl succeed
        sh '''
          echo "Waiting for health endpoint..."
          n=0
          until [ $n -ge 20 ]
          do
            if curl -f http://localhost:${APP_PORT}/health >/dev/null 2>&1; then
              echo "Health endpoint OK."
              break
            fi
            echo "Not healthy yet... ($n)"
            n=$((n+1))
            sleep 3
          done

          if [ $n -ge 20 ]; then
            echo "Health endpoint did not become healthy in time."
            docker-compose ps
            docker inspect --format='{{json .State.Health}}' ${CONTAINER_NAME} || true
            exit 1
          fi

          echo "Final container state:"
          docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
        '''
      }
    }
  }

  post {
    always {
      echo "Pipeline finished. Cleaning temp artifacts if any."
      // optionally keep containers running; if you want to teardown, uncomment:
      // sh 'docker-compose down'
    }
    failure {
      echo 'Pipeline failed!'
    }
    success {
      echo 'Pipeline succeeded!'
    }
  }
}
