#!/bin/bash
set -e

snap install amazon-ssm-agent --classic
systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

apt-get update -y
apt-get install -y docker.io
systemctl enable docker
systemctl start docker

usermod -aG docker ssm-user