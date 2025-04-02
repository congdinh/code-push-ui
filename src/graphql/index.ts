import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query Apps {
    dataApps @rest(type: "Apps", path: "apps", method: "GET") {
      apps {
        name
        collaborators
        deployments
      }
    }
  }
`;

export const GET_DEPLOYMENTS = gql`
  query Deployments($appName: String!) {
    dataDeployments(appName: $appName)
      @rest(
        type: "Deployments"
        method: "GET"
        path: "apps/{args.appName}/deployments"
        # path: "apps/:appName/deployments"
      ) {
      deployments {
        id
        key
        name @export(as: "name")
        package {
          description
          isDisabled
          isMandatory
          rollout
          appVersion
          packageHash
          blobUrl
          size
          manifestBlobUrl
          releaseMethod
          uploadTime
          label
          releasedBy
          diffPackageMap
        }
        versions(appName: $appName)
          @rest(
            # path: apps/:appName/deployments/:deploymentName/metrics
            path: "apps/{args.appName}/deployments/{exportVariables.name}/metrics"
            type: "Metrics"
            method: "GET"
          ) {
          metrics
        }
      }
    }
  }
`;

export const GET_DEPLOYMENT_METRICS = gql`
  query DeploymentMetrics($appName: String!, $deploymentName: String!) {
    dataDeploymentMetrics(appName: $appName, deploymentName: $deploymentName)
      @rest(
        # path: apps/:appName/deployments/:deploymentName/metrics
        path: "apps/{args.appName}/deployments/{args.deploymentName}/metrics"
        type: "Metrics"
        method: "GET"
      ) {
      versions: metrics
    }
  }
`;

export const GET_DEPLOYMENT_HISTORY = gql`
  query DeploymentHistory($appName: String!, $deploymentName: String!) {
    dataDeploymentHistory(appName: $appName, deploymentName: $deploymentName)
      @rest(
        path: "apps/{args.appName}/deployments/{args.deploymentName}/history"
        type: "DeploymentHistory"
        method: "GET"
      ) {
      history {
        description
        isDisabled
        isMandatory
        rollout
        appVersion
        packageHash
        blobUrl
        size
        manifestBlobUrl
        releaseMethod
        uploadTime
        label
        releasedBy
        diffPackageMap
      }
    }
  }
`;
