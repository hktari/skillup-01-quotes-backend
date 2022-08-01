# build the container and pushes it to amazon container registry

docker build . --tag skillup01-quotesapp
docker tag skillup01-quotesapp:latest 985850130508.dkr.ecr.eu-central-1.amazonaws.com/skillup01-quotesapp:latest

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 985850130508.dkr.ecr.eu-central-1.amazonaws.com

docker push 985850130508.dkr.ecr.eu-central-1.amazonaws.com/skillup01-quotesapp:latest

