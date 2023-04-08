#!/usr/bin/env groovy

pipeline {
    agent any

    tools {
        nodejs "NODE18"
    }

    stages {

        stage('increment version') {
            steps {
                    script {
                        echo 'incrementing app version...'
                        env.VERSION = sh (
                            script: 'npm --no-git-tag-version version patch',
                            returnStdout: true
                        ).trim()
                        echo "incrementing app version... ${VERSION}"
                      }
                  }
            }

        stage('build image') {
            steps {
                script {
                    echo "building the docker image..."
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                        sh "docker build -f Dockerfile.prod -t susah80/micro-frontend:${VERSION} ."
                        sh "echo $PASSWORD | docker login -u $USERNAME --password-stdin"
                        sh "docker push susah80/micro-frontend:${VERSION}"
                    }
                }
            }
        }

     stage('deploy app') {

            environment {
                AWS_ACCESS_KEY_ID = credentials("jenkins_aws_access_key_id")
                AWS_SECRET_ACCESS_KEY = credentials("jenkins_aws_secret_access_key")
            }

            steps {
                script {
                    echo 'deploying docker image...'
                    sh 'aws eks update-kubeconfig --name my-cluster --region eu-central-1'
                    sh 'envsubst < k8s/deployment.yaml | kubectl apply  -f -'                
                }
            }
        }


       stage('commit version update') {
            steps {
                script {

                    withCredentials([string(credentialsId: 'jenkins-github-token' , variable: 'GITHUB_TOKEN')]) {
                        // git config here for the first time run
                        sh 'git config --global user.email "jenkins@example.com"'
                        sh 'git config --global user.name "jenkins"'

                        sh 'git status'
                        sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/susahin80/micro-frontend.git"
                        sh 'git add .'
                        sh 'git commit -m "[ci-skip]"'
                        sh 'git push origin HEAD:master'
                    }


                }
            }
        }


    }
}

