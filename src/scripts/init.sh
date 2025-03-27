#!/bin/sh

##### Azure Continer Apps Deployment - Initialization script #####
# This script is used to create the necessary resources for the mobile app.
# It should be extended for multiple containers as required
# The script is divided into 5 steps:
# 1. Create a resource group
# 2. Initialize a VNet with subnets for the Azure Container Apps (ACA) environment and backing services (data layer)
# 3. Create an ACA environment and log analytics workspace
# 4. Deploy the container apps using azure build tools
# NOTE: this assumes that each Dockerfile is located at /src/<container-app-name>/Dockerfile

# Prompt for application name
printf "Enter Application Name: "
read APP_NAME

RESOURCE_GROUP_NAME="${APP_NAME}-rg"
RESOURCE_LOCATION="uksouth"
LOG_ANALYTICS_NAME="${APP_NAME}-logs"
VNET_NAME="${APP_NAME}-vnet"
BACKING_SUBNET_NAME="${APP_NAME}-backing-subnet"
CONTAINERAPP_ENVIRONMENT_NAME="${APP_NAME}-environment"
CONTAINERAPP_ENVIRONMENT_SUBNET_NAME="${APP_NAME}-environment-subnet"

set -x

echo "STEP 1: Create resource group..."
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location $RESOURCE_LOCATION

echo "STEP 2: Creating VNET..."
az network vnet create  \
    --resource-group $RESOURCE_GROUP_NAME    \
    --name $VNET_NAME    \
    --subnet-name $BACKING_SUBNET_NAME   \
    --location $RESOURCE_LOCATION    \
    --subnet-prefixes 10.0.0.0/24

az network vnet subnet create   \
    --resource-group $RESOURCE_GROUP_NAME   \
    --vnet-name $VNET_NAME  \
    --name $CONTAINERAPP_ENVIRONMENT_SUBNET_NAME    \
    --address-prefixes 10.0.1.0/24  \
    --delegations "Microsoft.App/environments"

INFRASTRUCTURE_SUBNET=`az network vnet subnet show  \
    --resource-group ${RESOURCE_GROUP_NAME}  \
    --vnet-name $VNET_NAME  \
    --name $CONTAINERAPP_ENVIRONMENT_SUBNET_NAME    \
    --query "id" -o tsv | tr -d '[:space:]'`

echo "STEP 3: Create ACA environment..."
az containerapp env create  \
    --name $CONTAINERAPP_ENVIRONMENT_NAME  \
    --resource-group $RESOURCE_GROUP_NAME    \
    --location $RESOURCE_LOCATION    \
    --logs-destination "log-analytics"    \
    --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET

echo "STEP 4: Deploy container apps..."
# You can add more container apps here, using the same pattern. Ingress type should only be external for reverse proxies (e.g. nginx)
CONTAINERAPP_NAME="backend"
az containerapp up  \
    --name $CONTAINERAPP_NAME  \
    --environment $CONTAINERAPP_ENVIRONMENT_NAME    \
    --resource-group $RESOURCE_GROUP_NAME    \
    --source ./src/${CONTAINERAPP_NAME}      # Path to the directory containing the Dockerfile
az containerapp update  \
    --name $CONTAINERAPP_NAME  \
    --resource-group $RESOURCE_GROUP_NAME    \
    --cpu 0.5   \
    --max-replicas 10 \
    --memory 1Gi \
    --min-replicas 1
az containerapp revision set-mode  \
    --name $CONTAINERAPP_NAME  \
    --resource-group $RESOURCE_GROUP_NAME    \
    --mode single
az containerapp ingress enable  \
    --name $CONTAINERAPP_NAME  \
    --resource-group $RESOURCE_GROUP_NAME   \
    --type external \
    --allow-insecure false  \
    --exposed-port 80   \
    --target-port 80    \
    --transport http

set +x
