#!/bin/sh

##### Azure Continer Apps Deployment - CICD setup script #####
# This script is used to set up CICD for the mobile app.
# It should be extended for multiple containers as required
# NOTE: this assumes that each Dockerfile is located at /src/<container-app-name>/Dockerfile

printf "Enter Application Name (MUST be same as deployed app): "
read APP_NAME

printf "Enter Azure Subscription ID: "
read _AZURE_SUBSCRIPTION_ID

printf "Enter branch name to deploy from: "
read APP_CICD_DEPLOYBRANCH

set -x

RESOURCE_GROUP_NAME="${APP_NAME}-rg"

CONTAINER_REGISTRY_NAME=$(az acr list --resource-group $RESOURCE_GROUP_NAME --query '[0].name' -o tsv)
CONTAINER_REGISTRY_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --query "passwords[0].value" -o tsv)
CONTAINER_REGISTRY_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --query "username" -o tsv)


output=$(az ad sp create-for-rbac \
    --name ${APP_NAME}-cicd \
    --role Contributor \
    --scopes "/subscriptions/${_AZURE_SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}")
_AZURE_CLIENT_ID=$(echo "$output" | grep -o '"appId": "[^"]*"' | sed 's/"appId": "\(.*\)"/\1/')
_AZURE_CLIENT_SECRET=$(echo "$output" | grep -o '"password": "[^"]*"' | sed 's/"password": "\(.*\)"/\1/')
_AZURE_TENANT_ID=$(echo "$output" | grep -o '"tenant": "[^"]*"' | sed 's/"tenant": "\(.*\)"/\1/')
AZ_CREDS_SECRET_VALUE="{\n\t\"clientId\":\"${_AZURE_CLIENT_ID}\",\n\t\"clientSecret\":\"${_AZURE_CLIENT_SECRET}\",\n\t\"subscriptionId\":\"${_AZURE_SUBSCRIPTION_ID}\",\n\t\"tenantId\":\"${_AZURE_TENANT_ID}\"\n}"

# Define variables for replacement
SECRET_STEM="$(echo "$APP_CICD_DEPLOYBRANCH" | tr '-' '_' | awk '{print toupper($0)}')"
APP_CICD_REGISTRY_USERNAME_SECRETNAME="${SECRET_STEM}_REGISTRY_USERNAME"
APP_CICD_REGISTRY_PASSWORD_SECRETNAME="${SECRET_STEM}_REGISTRY_PASSWORD"
APP_CICD_AZ_CREDS_SECRETNAME="${SECRET_STEM}_AZ_CREDS"
APP_CICD_RESOURCE_GROUP_NAME="${RESOURCE_GROUP_NAME}"
APP_CICD_REGISTRY_URL="${CONTAINER_REGISTRY_NAME}.azurecr.io"

# Input template file
SCRIPT_DIR=$(dirname "$(realpath "$0")")
TEMPLATE_FILE="$SCRIPT_DIR/deploy-template.yml"
OUTPUT_DIR="./.github/workflows"
# Ensure the .github/workflows folder exists
if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Directory $OUTPUT_DIR does not exist. Exiting."
  exit 1
fi

# Get the list of container apps in the resource group
CONTAINER_APPS=$(az containerapp list --resource-group $RESOURCE_GROUP_NAME --query '[].name' -o tsv)

# Loop through each container app
for APP_CICD_CONTAINER_NAME in $CONTAINER_APPS; do
    APP_CICD_YML_FILE_NAME="${APP_CICD_DEPLOYBRANCH}-${APP_CICD_CONTAINER_NAME}-deploy.yml"
    APP_CICD_APP_SOURCE_ROUTE="src/${APP_CICD_CONTAINER_NAME}"

    # Use sed to replace placeholders in the template file
    sed -e "s|{{_APP_CICD_DEPLOYBRANCH}}|$APP_CICD_DEPLOYBRANCH|g" \
        -e "s|{{_APP_CICD_YML_FILE_NAME}}|$APP_CICD_YML_FILE_NAME|g" \
        -e "s|{{_APP_CICD_AZ_CREDS_SECRETNAME}}|$APP_CICD_AZ_CREDS_SECRETNAME|g" \
        -e "s|{{_APP_CICD_APP_SOURCE_ROUTE}}|$APP_CICD_APP_SOURCE_ROUTE|g" \
        -e "s|{{_APP_CICD_REGISTRY_URL}}|$APP_CICD_REGISTRY_URL|g" \
        -e "s|{{_APP_CICD_REGISTRY_USERNAME_SECRETNAME}}|$APP_CICD_REGISTRY_USERNAME_SECRETNAME|g" \
        -e "s|{{_APP_CICD_REGISTRY_PASSWORD_SECRETNAME}}|$APP_CICD_REGISTRY_PASSWORD_SECRETNAME|g" \
        -e "s|{{_APP_CICD_RESOURCE_GROUP_NAME}}|$APP_CICD_RESOURCE_GROUP_NAME|g" \
        -e "s|{{_APP_CICD_CONTAINER_NAME}}|$APP_CICD_CONTAINER_NAME|g" \
        "$TEMPLATE_FILE" > ".github/workflows/$APP_CICD_YML_FILE_NAME"
done
set +x

# Print success message
echo "\n**Add the following secrets to you GitHub repo**\n"
echo "${APP_CICD_AZ_CREDS_SECRETNAME}=${AZ_CREDS_SECRET_VALUE}"
echo "${APP_CICD_REGISTRY_USERNAME_SECRETNAME}=${CONTAINER_REGISTRY_USERNAME}"
echo "${APP_CICD_REGISTRY_PASSWORD_SECRETNAME}=${CONTAINER_REGISTRY_PASSWORD}"
echo "\n***\n"