{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "Doxly Stack Template for QA/Demo",
  "Parameters" : {
    "ApplicationName": {
      "Description": "The name of this application",
      "Type": "String",
      "MinLength": "1",
      "Default": "doxly"
    },
    "KeyName" : {
      "Description" : "Name of an existing EC2 KeyPair to enable SSH access to the Opsworks instances",
      "Type" : "String",
      "MinLength": "1",
      "MaxLength": "64",
      "AllowedPattern" : "[-_ a-zA-Z0-9]*",
      "ConstraintDescription" : "can contain only alphanumeric characters, spaces, dashes and underscores."
    },
    "KeyNameNAT" : {
      "Description" : "Name of an existing EC2 KeyPair to enable SSH access to the NAT instance",
      "Type" : "String",
      "MinLength": "1",
      "MaxLength": "64",
      "AllowedPattern" : "[-_ a-zA-Z0-9]*",
      "ConstraintDescription" : "can contain only alphanumeric characters, spaces, dashes and underscores."
    },
    "CookbookRepo": {
      "Description": "Which repository to pull the application from",
      "Type": "String",
      "MinLength": "1",
      "Default": "git@github.com:doxly-inc/chef-cookbooks.git"
    },
    "CookbookRepositoryKey": {
      "Description": "A private key that can be used to fetch the custom cookbook code from the GitHub repository",
      "Type": "String",
      "MinLength": "1",
      "NoEcho": true
    },
    "CookbookRevision": {
      "Description": "The branch / tag you wish the Opsworks Stack to pull its configuration from",
      "Type": "String",
      "MinLength": "1",
      "MaxLength": "64",
      "Default": "master"
    },
    "ApplicationRepo": {
      "Description": "Which repository to pull the application from",
      "Type": "String",
      "MinLength": "1",
      "Default": "git@github.com:doxly-inc/doxly.git"
    },
    "ApplicationRevision": {
      "Description": "The branch / tag you wish the Opsworks Stack to pull its application from",
      "Type": "String",
      "MinLength": "1",
      "MaxLength": "64",
      "Default": "master"
    },
    "ApplicationKey": {
      "Description": "A private key that can be used to fetch the app code from the GitHub repository",
      "Type": "String",
      "MinLength": "1",
      "NoEcho": true
    },
    "RDSInstanceType" : {
      "Type" : "String",
      "Default" : "db.m3.medium",
      "AllowedValues" : ["db.m3.medium", "db.m3.large", "db.m3.xlarge", "db.m3.2xlarge", "db.r3.large", "db.r3.xlarge", "db.r3.2xlarge", "db.r3.4xlarge", "db.r3.8xlarge"],
      "Description" : "Enter db.m3.medium (1 vCPU, 3.75GB memory, Moderate network performance), db.m3.large (2 vCPU 7.5GB memory, Moderate network performance), db.m3.xlarge (4 vCPU, 15GB memory, Moderate network performance), db.m3.2xlarge (8 vCPU, 30GB memory, High network performance), db.r3.large (2 vCPU 15GB memory, Moderate network performance), db.r3.xlarge (4 vCPU, 30.5GB memory, Moderate network performance), db.r3.2xlarge (8 vCPU, 61GB memory, High network performance), db.r3.4xlarge (16 vCPU, 122GB memory, High network performance), db.r3.8xlarge (32 vCPU, 244GB memory, 10 Gigabit network performance). Default is db.m3.medium."
    },
    "RDSStorageSize" : {
      "Type" : "Number",
      "Default" : "100",
      "MinValue" : "100",
      "Description": "Enter the size in Gigabytes of RDS database storage. Min 100GB"
    },
    "RDSBackupLength" : {
      "Type" : "Number",
      "Default": "1",
      "MinValue": "1",
      "MaxValue": "35",
      "Description": "Enter the number of days to retain automated backups in RDS. Min 1, Max 35."
    },
    "RDSUsername": {
      "Type": "String",
      "Default": "doxly",
      "Description": "RDS DB username"
    },
    "RDSPassword": {
      "Type": "String",
      "Description": "RDS DB password",
      "NoEcho": true
    },
    "DatabaseName": {
      "Type": "String",
      "Default": "doxly_production",
      "Description": "The database name",
      "MinLength": "1"
    },
    "NATNodeInstanceType" : {
      "Description" : "Instance type for NAT nodes.",
      "Type" : "String",
      "Default" : "t1.micro",
      "AllowedValues" : [ "t1.micro","m1.small","m1.medium","m1.large","m1.xlarge","m2.xlarge","m2.2xlarge","m2.4xlarge","c1.medium","c1.xlarge","cc1.4xlarge","cc2.8xlarge","cg1.4xlarge"],
      "ConstraintDescription" : "must be a valid EC2 instance type."
    },
    "MonitEmail": {
      "Description": "Email address that monit alerts should come from",
      "Type": "String",
      "MinLength": "1",
      "Default": "moses@doxly.com"
    },
    "ReplyEmail": {
      "Description": "Email address that all the notifications from the app come from",
      "Type": "String",
      "MinLength": "1",
      "Default": "success@doxly.com"
    },
    "SupportEmail": {
      "Description": "Email address of doxly support",
      "Type": "String",
      "MinLength": "1",
      "Default": "support@doxly.com"
    },
    "AlertsEmail": {
      "Description": "Email address of doxly support alerts",
      "Type": "String",
      "MinLength": "1",
      "Default": "development@doxly.com"
    },
    "AlertsReplyEmail": {
      "Description": "Email address that the doxly support alerts come from",
      "Type": "String",
      "MinLength": "1",
      "Default": "alerts@doxly.com"
    },
    "AdminEmail": {
      "Description": "Email address of doxly app admin",
      "Type": "String",
      "MinLength": "1",
      "Default": "moses@doxly.com"
    },
    "FeedsEmail": {
      "Description": "Email address for the doxly weekly feeds",
      "Type": "String",
      "MinLength": "1",
      "Default": "natalie@doxly.com"
    },
    "MailSafeEnabled": {
      "Description": "Whether or not MailSafe should be enabled",
      "Type": "String",
      "AllowedValues": ["true", "false"],
      "Default": "true"
    },
    "MailSafeDestination": {
      "Description": "Where MailSafe emails should be directed",
      "Type": "String",
      "MinLength": "1",
      "Default": "development@doxly.com"
    },
    "SMTPHost": {
      "Description": "The SMTP host to send emails through",
      "Type": "String",
      "MinLength": "1",
      "Default": "email-smtp.us-east-1.amazonaws.com"
    },
    "SMTPPort": {
      "Description": "The SMTP port to send emails through",
      "Type": "Number",
      "Default": 587
    },
    "SMTPUser": {
      "Description": "The SMTP user to authenticate as",
      "Type": "String",
      "MinLength": "1"
    },
    "SMTPPassword": {
      "Description": "The SMTP password to authenticate with",
      "Type": "String",
      "NoEcho": true
    },
    "DocusignDemoUrl": {
      "Description": "The Docusign API endpoint for a demo account",
      "Type": "String",
      "MinLength": "1",
      "Default": "https://demo.docusign.net/restapi"
    },
    "DocusignLiveUrl": {
      "Description": "The Docusign API endpoint for a live account",
      "Type": "String",
      "MinLength": "1",
      "Default": "https://www.docusign.net/restapi"
    },
    "RollbarClientToken": {
      "Description": "The Client Token of the Rollbar account",
      "Type": "String",
      "Default": ""
    },
    "RollbarServerToken": {
      "Description": "The Server Token of the Rollbar account",
      "Type": "String",
      "Default": ""
    },
    "RollbarServerToken": {
      "Description": "The Server Token of the Rollbar account",
      "Type": "String",
      "Default": ""
    },
    "GoogleAnalyticsToken": {
      "Description": "The token for google analytics",
      "Type": "String",
      "Default": ""
    },
    "EncryptionPassword": {
      "Description": "The encryption password used to encrypt Docusign password",
      "Type": "String",
      "Default": ""
    },
    "ZendeskSecret": {
      "Description": "The secret hash used to connect to Zendesk",
      "Type": "String",
      "Default": ""
    },
    "DealEmailBeginning": {
      "Description": "The username part of the deal email",
      "Type": "String",
      "Default": ""
    },
    "DealEmailEnding": {
      "Description": "The domain part of the deal email",
      "Type": "String",
      "Default": ""
    },
    "DealEmailUsername": {
      "Description": "The username part of the deal email",
      "Type": "String",
      "Default": ""
    },
    "DealEmailPassword": {
      "Description": "The password of the deal email",
      "Type": "String",
      "Default": ""
    },
    "DefaultAdminUsername": {
      "Description": "The username (email) of the default admin account",
      "Type": "String",
      "Default": ""
    },
    "DefaultAdminPassword": {
      "Description": "The password of the default admin account",
      "Type": "String",
      "Default": ""
    },
    "ServiceRoleArn": {
      "Description": "The initial service role ARN for the OpsWorks stack",
      "Type": "String",
      "MinLength": "1",
      "Default": "arn:aws:iam::430974659261:role/aws-opsworks-service-role"
    },
    "HostName": {
      "Description": "The host name that this stack will respond to",
      "Type": "String",
      "MinLength": "1",
      "Default": "app.doxly.com"
    },
    "ProdSecretKeybase": {
      "Description": "The secret hash for production",
      "Type": "String"
    },
    "DBSnapshotName": {
      "Description": "The name of the DB snapshot to base the new RDS instance off of",
      "Type": "String"
    },
    "KmsKeyArn": {
      "Description": "The ARN of the AWS Key Management Service master key that is used to encrypt a newly created database instance. If restoring from a backup, leave this empty.",
      "Type": "String"
    },
    "DocusignIntegratorKey": {
      "Description": "The Doxly App Integration Key For The DocuSign API.",
      "Type": "String"
    },
    "JavaHomePath": {
      "Description": "The path to JVM",
      "Type": "String",
      "Default": "/usr/lib/jvm/default-java"
    },
    "CloudConvertAPIKey": {
      "Description": "The API key for the CloudConvert service.",
      "Type": "String"
    },
    "MinimumDocumentRetentionMinutesDuration": {
      "Description": "The minimum duration for keeping the dms documents till they expire and are deleted.",
      "Type": "String",
      "Default": "60"
    },
    "NetDocumentsUSApiUrl": {
      "Description": "The NetDocuments integration api url for US.",
      "Type": "String"
    },
    "NetDocumentsEUApiUrl": {
      "Description": "The NetDocuments integration api url for EU.",
      "Type": "String"
    },
    "NetDocumentsAUApiUrl": {
      "Description": "The NetDocuments integration api url for AU.",
      "Type": "String"
    },
    "NetDocumentsApiVersionNumber": {
      "Description": "The NetDocuments integration api version number.",
      "Type": "String"
    },
    "NetDocumentsUSLoginBaseUrl": {
      "Description": "The NetDocuments integration base url for US.",
      "Type": "String"
    },
    "NetDocumentsEULoginBaseUrl": {
      "Description": "The NetDocuments integration base url for EU.",
      "Type": "String"
    },
    "NetDocumentsAULoginBaseUrl": {
      "Description": "The NetDocuments integration base url for AU.",
      "Type": "String"
    },
    "OtpSecretEncryptionKey": {
      "Description": "The OTP secret encryption key for MFA.",
      "Type": "String"
    }
  },
  "Mappings" : {
      "Region2AZ" : {
        "us-west-2" : { "AZ" : ["us-west-2a", "us-west-2b", "us-west-2c"] },
        "us-east-1" : { "AZ" : ["us-east-1a", "us-east-1b", "us-east-1c"] },
        "eu-west-1" : { "AZ" : ["eu-west-1a", "eu-west-1b", "eu-west-1c"] },
        "ap-northeast-1" : { "AZ" : ["ap-northeast-1a", "ap-northeast-1b", "ap-northeast-1c"] }
      },
      "AWSNATAMI" : {
        "us-east-1"      : { "AMI" : "ami-809f4ae8" },
        "us-west-2"      : { "AMI" : "ami-49691279" },
        "eu-west-1"      : { "AMI" : "ami-6d60b01a" },
        "ap-northeast-1" : { "AMI" : "ami-31c29e30" }
      }
  },
  "Conditions": {
    "UseDBSnapshot": {"Fn::Not": [{"Fn::Equals" : [{"Ref" : "DBSnapshotName"}, ""]}]},
    "IsQA": {"Fn::Equals" : [{"Ref": "AWS::StackName"}, "qa"]}
  },
  "Resources": {
    "NATRole": {
       "Type": "AWS::IAM::Role",
       "Properties": {
          "AssumeRolePolicyDocument": {
             "Statement": [ {
                "Effect": "Allow",
                "Principal": {
                   "Service": [ "ec2.amazonaws.com" ]
                },
                "Action": [ "sts:AssumeRole" ]
             } ]
          },
          "Path": "/",
          "Policies": [ {
             "PolicyName": "NAT_Takeover",
             "PolicyDocument": {
                "Statement": [ {
                   "Effect": "Allow",
                   "Action": [
                        "ec2:DescribeInstances",
                        "ec2:DescribeRouteTables",
                        "ec2:CreateRoute",
                        "ec2:ReplaceRoute",
                        "ec2:StartInstances",
                        "ec2:StopInstances"
                   ],
                   "Resource": "*"
                } ]
             }
             } ]
          }
    },
    "NATRoleProfile": {
       "Type": "AWS::IAM::InstanceProfile",
       "Properties": {
          "Path": "/",
          "Roles": [ {
             "Ref": "NATRole"
          } ]
       }
    },
    "vpc": {
      "Type": "AWS::EC2::VPC",
      "Properties": {
        "CidrBlock": "10.0.0.0/16",
        "InstanceTenancy": "default",
        "EnableDnsSupport": "true",
        "EnableDnsHostnames": "true",
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "subnetregion1": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.0.0/24",
        "AvailabilityZone": { "Fn::Select" : [0, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "subnetregion2": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.1.0/24",
        "AvailabilityZone": { "Fn::Select" : [1, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "subnetregion3": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.2.0/24",
        "AvailabilityZone": { "Fn::Select" : [2, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "publicsubnetregion1": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.201.0/24",
        "AvailabilityZone": { "Fn::Select" : [0, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Public" }]
      }
    },
    "publicsubnetregion2": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.202.0/24",
        "AvailabilityZone": { "Fn::Select" : [1, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Public" }]
      }
    },
    "publicsubnetregion3": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.203.0/24",
        "AvailabilityZone": { "Fn::Select" : [2, { "Fn::FindInMap" : [ "Region2AZ", { "Ref" : "AWS::Region" }, "AZ" ] } ] },
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Public" }]
      }
    },
    "internetgateway": {
      "Type": "AWS::EC2::InternetGateway",
      "Properties": {
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "dhcpoptions": {
      "Type": "AWS::EC2::DHCPOptions",
      "Properties": {
        "DomainName": "ec2.internal",
        "DomainNameServers": [
          "AmazonProvidedDNS"
        ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "vpcnetworkacl": {
      "Type": "AWS::EC2::NetworkAcl",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "vpcroutetable1": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "vpcroutetable2": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "vpcroutetable3": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Private" }]
      }
    },
    "publicvpcroutetable": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "Visibility", "Value": "Public" }]
      }
    },
    "routevpctointernetgateway": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "publicvpcroutetable"
        },
        "GatewayId": {
          "Ref": "internetgateway"
        }
      },
      "DependsOn": "vpcgatewayattachment"
    },
    "privateroute1" : {
      "Type" : "AWS::EC2::Route",
      "Properties" : {
        "RouteTableId" : { "Ref" : "vpcroutetable1" },
        "DestinationCidrBlock" : "0.0.0.0/0",
        "InstanceId" : { "Ref" : "NATInstance" }
      }
    },
    "privateroute2" : {
      "Type" : "AWS::EC2::Route",
      "Properties" : {
        "RouteTableId" : { "Ref" : "vpcroutetable2" },
        "DestinationCidrBlock" : "0.0.0.0/0",
        "InstanceId" : { "Ref" : "NATInstance" }
      }
    },
    "privateroute3" : {
      "Type" : "AWS::EC2::Route",
      "Properties" : {
        "RouteTableId" : { "Ref" : "vpcroutetable3" },
        "DestinationCidrBlock" : "0.0.0.0/0",
        "InstanceId" : { "Ref" : "NATInstance" }
      }
    },
    "addsubnetregion1toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "subnetregion1" },
        "RouteTableId" : { "Ref": "vpcroutetable1" }
      }
    },
    "addsubnetregion2toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "subnetregion2" },
        "RouteTableId" : { "Ref": "vpcroutetable2" }
      }
    },
    "addsubnetregion3toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "subnetregion3" },
        "RouteTableId" : { "Ref": "vpcroutetable3" }
      }
    },
    "addpublicsubnetregion1toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "publicsubnetregion1" },
        "RouteTableId" : { "Ref": "publicvpcroutetable" }
      }
    },
    "addpublicsubnetregion2toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "publicsubnetregion2" },
        "RouteTableId" : { "Ref": "publicvpcroutetable" }
      }
    },
    "addpublicsubnetregion3toroutetable": {
      "Type" : "AWS::EC2::SubnetRouteTableAssociation",
      "Properties" : {
        "SubnetId" : { "Ref": "publicsubnetregion3" },
        "RouteTableId" : { "Ref": "publicvpcroutetable" }
      }
    },
    "NATEIP" : {
      "Type" : "AWS::EC2::EIP",
      "Properties" : {
        "Domain" : "vpc",
        "InstanceId" : { "Ref" : "NATInstance" }
      }
    },
    "NATInstance" : {
      "Type" : "AWS::EC2::Instance",
      "Metadata" : {
        "Comment1" : "Create NAT"
      },
      "Properties" : {
        "InstanceType" : { "Ref" : "NATNodeInstanceType" } ,
        "KeyName" : { "Ref" : "KeyNameNAT" },
        "IamInstanceProfile" : { "Ref" : "NATRoleProfile" },
        "SubnetId" : { "Ref" : "publicsubnetregion1" },
        "SourceDestCheck" : "false",
        "ImageId" : { "Fn::FindInMap" : [ "AWSNATAMI", { "Ref" : "AWS::Region" }, "AMI" ]},
        "SecurityGroupIds" : [{ "Ref" : "NATSecurityGroup" }],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "NATSecurityGroup" : {
      "Type" : "AWS::EC2::SecurityGroup",
      "Properties" : {
        "GroupDescription" : "Rules for allowing access to NAT Nodes",
        "VpcId" : { "Ref" : "vpc" },
        "SecurityGroupIngress" : [
           { "IpProtocol" : "tcp", "FromPort" : "22",  "ToPort" : "22",  "CidrIp" : "0.0.0.0/0" } ,
           { "IpProtocol" : "-1", "FromPort" : "0",  "ToPort" : "65535",  "CidrIp" : "10.0.0.0/16" } ],
        "SecurityGroupEgress" : [
           { "IpProtocol" : "-1", "FromPort" : "0", "ToPort" : "65535", "CidrIp" : "0.0.0.0/0" } ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "NATAllowICMP" : {
      "Type" : "AWS::EC2::SecurityGroupIngress",
      "Properties" : {
        "GroupId" : { "Ref" : "NATSecurityGroup" },
        "IpProtocol" : "icmp",
        "FromPort" : "-1",
        "ToPort" : "-1",
        "SourceSecurityGroupId" : { "Ref" : "NATSecurityGroup" }
      }
    },
    "doxlyelb": {
      "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties": {
        "Subnets": [
          { "Ref": "publicsubnetregion1" },
          { "Ref": "publicsubnetregion2" },
          { "Ref": "publicsubnetregion3" }
        ],
        "ConnectionSettings": {
          "IdleTimeout": 120
        },
        "HealthCheck": {
          "HealthyThreshold": "5",
          "Interval": "20",
          "Target": "TCP:80",
          "Timeout": "15",
          "UnhealthyThreshold": "5"
        },
        "Instances": [
        ],
        "Listeners": [
          {
            "InstancePort": "80",
            "LoadBalancerPort": "80",
            "Protocol": "HTTP",
            "InstanceProtocol": "HTTP"
          }
        ],
        "SecurityGroups": [
          { "Ref": "sginboundweb" },
          { "Ref": "sgdefault" }
        ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }],
        "CrossZone": true
      }
    },
    "doxlyrds": {
      "Type": "AWS::RDS::DBInstance",
      "Properties": {
        "AutoMinorVersionUpgrade": "true",
        "DBInstanceClass": { "Ref": "RDSInstanceType" },
        "Port": "5432",
        "AllocatedStorage": { "Ref": "RDSStorageSize" },
        "BackupRetentionPeriod": { "Ref": "RDSBackupLength" },
        "DBName": {
          "Fn::If" : [
            "UseDBSnapshot",
            {"Ref" : "AWS::NoValue"},
            { "Ref": "DatabaseName" }
          ]
        },
        "Engine": "postgres",
        "EngineVersion": "9.6.3",
        "LicenseModel": "postgresql-license",
        "MasterUsername": { "Ref": "RDSUsername" },
        "MasterUserPassword": { "Ref": "RDSPassword" },
        "PreferredBackupWindow": "05:03-05:33",
        "PreferredMaintenanceWindow": "fri:07:18-fri:07:48",
        "DBSnapshotIdentifier": {
          "Fn::If" : [
            "UseDBSnapshot",
            {"Ref" : "DBSnapshotName"},
            {"Ref" : "AWS::NoValue"}
          ]
        },
        "StorageEncrypted": {
          "Fn::If" : [
            "UseDBSnapshot",
            {"Ref" : "AWS::NoValue"},
            true
          ]
        },
        "KmsKeyId": {
          "Fn::If" : [
            "UseDBSnapshot",
            {"Ref" : "AWS::NoValue"},
            {"Ref" : "KmsKeyArn"}
          ]
        },
        "MultiAZ": {
          "Fn::If" : ["IsQA", false, true]
        },
        "VPCSecurityGroups": [
          {
            "Ref": "sgawstords"
          },
          {
            "Ref": "sgdefault"
          }
        ],
        "DBSubnetGroupName": {
          "Ref": "dbsgvpcsubnets"
        },
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }, { "Key": "workload-type", "Value": "production" }]
      }
    },
    "s3uploadbucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "dbsgvpcsubnets": {
      "Type": "AWS::RDS::DBSubnetGroup",
      "Properties": {
        "DBSubnetGroupDescription": "doxly-subnet-group",
        "SubnetIds": [
          {
            "Ref": "subnetregion3"
          },
          {
            "Ref": "subnetregion2"
          },
          {
            "Ref": "subnetregion1"
          }
        ]
      }
    },
    "sgdefault": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "default VPC security group",
        "VpcId": {
          "Ref": "vpc"
        },
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "22",
            "ToPort": "22",
            "CidrIp": "0.0.0.0/0"
          }
        ],
        "SecurityGroupEgress": [
          {
            "IpProtocol": "-1",
            "CidrIp": "0.0.0.0/0"
          }
        ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "sgawstords": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Allows Opsworks in VPC to contact RDS",
        "VpcId": {
          "Ref": "vpc"
        },
        "SecurityGroupEgress": [
          {
            "IpProtocol": "-1",
            "CidrIp": "0.0.0.0/0"
          }
        ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "sginboundweb": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "All source traffic to dest 80",
        "VpcId": {
          "Ref": "vpc"
        },
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "80",
            "ToPort": "80",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "443",
            "ToPort": "443",
            "CidrIp": "0.0.0.0/0"
          }
        ],
        "SecurityGroupEgress": [
          {
            "IpProtocol": "-1",
            "CidrIp": "0.0.0.0/0"
          }
        ],
        "Tags": [ { "Key": "Stack", "Value": { "Ref": "AWS::StackName" } }, { "Key": "Application", "Value": { "Ref": "ApplicationName" } }]
      }
    },
    "networkacl1": {
      "Type": "AWS::EC2::NetworkAclEntry",
      "Properties": {
        "CidrBlock": "0.0.0.0/0",
        "Egress": true,
        "Protocol": "-1",
        "RuleAction": "allow",
        "RuleNumber": "100",
        "NetworkAclId": {
          "Ref": "vpcnetworkacl"
        }
      }
    },
    "networkacl2": {
      "Type": "AWS::EC2::NetworkAclEntry",
      "Properties": {
        "CidrBlock": "0.0.0.0/0",
        "Protocol": "-1",
        "RuleAction": "allow",
        "RuleNumber": "100",
        "NetworkAclId": {
          "Ref": "vpcnetworkacl"
        }
      }
    },
    "subnetacl1": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "vpcnetworkacl"
        },
        "SubnetId": {
          "Ref": "subnetregion3"
        }
      }
    },
    "subnetacl2": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "vpcnetworkacl"
        },
        "SubnetId": {
          "Ref": "subnetregion1"
        }
      }
    },
    "subnetacl3": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "vpcnetworkacl"
        },
        "SubnetId": {
          "Ref": "subnetregion2"
        }
      }
    },
    "vpcgatewayattachment": {
      "Type": "AWS::EC2::VPCGatewayAttachment",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "InternetGatewayId": {
          "Ref": "internetgateway"
        }
      }
    },
    "vpcdhcpassociation": {
      "Type": "AWS::EC2::VPCDHCPOptionsAssociation",
      "Properties": {
        "VpcId": {
          "Ref": "vpc"
        },
        "DhcpOptionsId": {
          "Ref": "dhcpoptions"
        }
      }
    },
    "ingresssgdefaultinternalaccess": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgdefault"
        },
        "IpProtocol": "-1",
        "SourceSecurityGroupId": {
          "Ref": "sgdefault"
        }
      }
    },
    "ingresssgdefaultallowedaccesstords": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgawstords"
        },
        "IpProtocol": "tcp",
        "FromPort": "5432",
        "ToPort": "5432",
        "SourceSecurityGroupId": {
          "Ref": "sgdefault"
        }
      }
    },
    "gwrecord" : {
      "Type" : "AWS::Route53::RecordSet",
      "Properties" : {
          "HostedZoneName" : "doxly.com.",
          "Comment" : { "Fn::Join" : [" ", ["SSH gateway alias for ", { "Ref": "AWS::StackName" }] ] },
          "Name" : { "Fn::Join" : [".", ["nat", { "Ref": "AWS::StackName" }, "doxly.com." ]]},
          "Type" : "A",
          "TTL": "300",
          "ResourceRecords": [
            { "Ref": "NATEIP" }
          ]
      }
    },
    "appuser" : {
      "Type" : "AWS::IAM::User",
      "Properties" : {
      }
    },
    "deployuser" : {
      "Type" : "AWS::IAM::User",
      "Properties" : {
      }
    },
    "apppolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": { "Fn::Join" : ["_", [{"Ref": "AWS::StackName"}, "App_Policy"]]},
        "PolicyDocument" : {
          "Statement": [
            { "Effect" : "Allow", "Action": ["ec2:*"], "Resource": "*", "Condition": { "StringEquals": { "ec2:ResourceTag/Stack": { "Ref": "AWS::StackName" } } } },
            { "Effect" : "Allow", "Action": ["ec2:*"], "Resource": "*", "Condition": { "StringEquals": { "ec2:ResourceTag/opsworks:stack": { "Ref": "AWS::StackName" } } } },
            { "Effect" : "Allow", "Action": ["ec2:DescribeInstances"], "Resource": "*" },
            { "Effect" : "Allow", "Action": ["s3:ListAllMyBuckets"],  "Resource": { "Fn::Join" : [ "", ["arn:aws:s3:::*"] ] } },
            { "Effect" : "Allow", "Action": ["s3:ListBucket", "s3:GetBucketLocation"],  "Resource": { "Fn::Join" : [ "", ["arn:aws:s3:::", {"Ref": "s3uploadbucket" }] ] } },
            { "Effect" : "Allow", "Action": ["s3:*"],  "Resource": { "Fn::Join" : [ "", ["arn:aws:s3:::", {"Ref": "s3uploadbucket" }, "/*"] ] } },
            { "Effect" : "Allow", "Action": ["rds:*"], "Resource": { "Fn::Join" : [ "", ["arn:aws:rds:", { "Ref": "AWS::Region" }, ":", {"Ref": "AWS::AccountId" }, ":db:", { "Ref": "DatabaseName" }] ] } }
          ]
        },
        "Users": [ { "Ref": "appuser" }]
      }
    },
    "opsworkspolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": { "Fn::Join" : ["_", [{"Ref": "AWS::StackName"}, "OpsworksDeploy_Policy"]]},
        "PolicyDocument" : {
          "Statement": [
            { "Effect" : "Allow", "Action": ["opsworks:*"],    "Resource": { "Fn::Join": ["", ["arn:aws:opsworks:*:*:stack/", {"Ref": "opsworksstack" }]] } },
            { "Effect" : "Allow", "Action": ["opsworks:DescribeStacks", "opsworks:DescribeApps", "opsworks:DescribeLayers", "opsworks:DescribeInstances", "opsworks:CreateDeployment", "opsworks:DescribeDeployments"], "Resource": "*" }
          ]
        },
        "Users": [ { "Ref": "appuser" }, { "Ref": "deployuser" }]
      }
    },
    "cloudformationpolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": { "Fn::Join" : ["_", [{"Ref": "AWS::StackName"}, "CloudformationDeploy_Policy"]]},
        "PolicyDocument" : {
          "Statement": [
            {
              "Effect" : "Allow",
              "Action": [
                "cloudformation:DescribeStacks"
              ],
              "Resource": "*"
            },
            {
              "Effect" : "Allow",
              "Action": [
                "cloudformation:DescribeStackEvents",
                "cloudformation:DescribeStackResources",
                "cloudformation:GetTemplate",
                "cloudformation:ValidateTemplate",
                "cloudformation:UpdateStack"
              ],
              "Resource": { "Fn::Join": ["", ["arn:aws:cloudformation:", { "Ref" : "AWS::Region" }, ":", {"Ref": "AWS::AccountId" } ,":stack/", {"Ref": "AWS::StackName" }, "*"]] }
            }
          ]
        },
        "Users": [ { "Ref": "deployuser" } ]
      }
    },
    "opsworksstackpolicy": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyName": { "Fn::Join" : ["_", [{"Ref": "AWS::StackName"}, "OpsworksStack_Policy"]]},
        "PolicyDocument" : {
          "Statement": [
            { "Effect" : "Allow", "Action": ["ec2:*"], "Resource": "*" },
            { "Effect" : "Allow", "Action": ["rds:*"], "Resource": "*" }
          ]
        },
        "Roles": [ { "Ref": "opsworksstackrole" } ]
      }
    },
    "opsworksstackrole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Principal": { "Service": [ "ec2.amazonaws.com" ] },
              "Action": ["sts:AssumeRole"]
            }
          ]
        },
        "Policies": [
          {
            "PolicyName": "OpsworksControl",
            "PolicyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect" : "Allow",
                  "Action": [
                    "ec2:*",
                    "iam:PassRole",
                    "cloudwatch:GetMetricStatistics",
                    "elasticloadbalancing:*"
                  ],
                  "Resource": "*"
                }
              ]
            }
          }
        ],
        "Path": "/"
      }
    },
    "opsworksinstancerole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Principal": { "Service": [ "ec2.amazonaws.com" ] },
              "Action": ["sts:AssumeRole"]
            }
          ]
        },
        "Policies": [
          {
            "PolicyName": "Logging",
            "PolicyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect" : "Allow",
                  "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:GetLogEvents",
                    "logs:PutLogEvents",
                    "logs:DescribeLogGroups",
                    "logs:DescribeLogStreams"
                  ],
                  "Resource": "*"
                }
              ]
            }
          }
        ],
        "Path": "/"
      }
    },
    "opsworksinstanceprofile": {
      "Type": "AWS::IAM::InstanceProfile",
      "Properties": {
        "Path": "/",
        "Roles": [
          { "Ref": "opsworksinstancerole" }
        ]
      }
    },
    "appkey": {
      "Type" : "AWS::IAM::AccessKey",
      "Properties": {
        "Status": "Active",
        "UserName": { "Ref": "appuser" }
      }
    },
    "deploykey": {
      "Type" : "AWS::IAM::AccessKey",
      "Properties": {
        "Status": "Active",
        "UserName": { "Ref": "deployuser" }
      }
    },
    "opsworksstack": {
      "Type" : "AWS::OpsWorks::Stack",
      "Properties" : {
        "ConfigurationManager" : {
          "Name": "Chef",
          "Version": "11.10"
        },
        "CustomCookbooksSource" : {
          "Type": "git",
          "Url": { "Ref": "CookbookRepo" },
          "SshKey": { "Ref": "CookbookRepositoryKey" },
          "Revision": { "Ref": "CookbookRevision" }
        },
        "CustomJson" : {
          "opsworks": {
            "ruby_version": "2.3"
          },
          "opsworks_rubygems": {
            "version": "2.6.13"
          },
          "opsworks_bundler": {
            "manage_package": true
          },
          "rails" : {
            "max_pool_size": 4
          },
          "passenger" : {
            "max_instances_per_app": 4,
            "pool_idle_time": 0
          },
          "deploy": {
            "doxly": {
              "database": {
                "adapter": "postgresql",
                "encoding": "unicode",
                "database": { "Ref": "DatabaseName" },
                "username": { "Ref": "RDSUsername" },
                "password": { "Ref": "RDSPassword" },
                "host": { "Fn::GetAtt" : [ "doxlyrds", "Endpoint.Address" ]},
                "port": { "Fn::GetAtt" : [ "doxlyrds", "Endpoint.Port" ]}
              },
              "config_yml": {
                "monit_email": { "Ref": "MonitEmail" },
                "host_name": { "Ref": "HostName" },
                "port": 80,
                "protocol": "https",
                "reply_email": { "Ref": "ReplyEmail" },
                "support_email": { "Ref": "SupportEmail" },
                "alerts_email": { "Ref": "AlertsEmail" },
                "alerts_reply_email": { "Ref": "AlertsReplyEmail" },
                "admin_email": { "Ref": "AdminEmail" },
                "feeds_email": { "Ref": "FeedsEmail" },
                "aws_enabled": true,
                "aws_access_key_id": { "Ref": "appkey" },
                "aws_secret_access_key": { "Fn::GetAtt" : [ "appkey", "SecretAccessKey" ]},
                "aws_region": "us-east-1",
                "mail_safe": { "Ref": "MailSafeEnabled" },
                "mail_safe_destination": { "Ref": "MailSafeDestination" },
                "smtp_host": { "Ref": "SMTPHost" },
                "smtp_port": { "Ref": "SMTPPort" },
                "smtp_user": { "Ref": "SMTPUser" },
                "smtp_password": { "Ref": "SMTPPassword" },
                "smtp_authtype": "login",
                "smtp_starttls_auto" : true,
                "s3_bucket": { "Ref": "s3uploadbucket" },
                "docusign_demo_url": { "Ref": "DocusignDemoUrl" },
                "docusign_live_url": { "Ref": "DocusignLiveUrl" },
                "docusign_api_version": "v2",
                "records_per_page": "20",
                "min_ie_version": "11",
                "min_edge_version": "14",
                "min_firefox_version": "45",
                "min_chrome_version": "50",
                "min_opera_version": "37",
                "min_safari_version": "9.1",
                "ie_user_agent_name": "Internet Explorer",
                "edge_user_agent_name": "Edge",
                "firefox_user_agent_name": "Firefox",
                "chrome_user_agent_name": "Chrome",
                "safari_user_agent_name": "Safari",
                "opera_user_agent_name": "Opera",
                "rollbar_client_token": { "Ref": "RollbarClientToken" },
                "rollbar_server_token": { "Ref": "RollbarServerToken" },
                "ga_token": { "Ref": "GoogleAnalyticsToken" },
                "encryption_password": { "Ref": "EncryptionPassword" },
                "zendesk_base_url": "https://doxlyhelp.zendesk.com",
                "zendesk_secret": { "Ref": "ZendeskSecret" },
                "mailtrap_username": "",
                "mailtrap_password": "",
                "deal_email_beginning": { "Ref": "DealEmailBeginning" },
                "deal_email_ending": { "Ref": "DealEmailEnding" },
                "deal_email_username": { "Ref": "DealEmailUsername" },
                "deal_email_password": { "Ref": "DealEmailPassword" },
                "default_admin_username": { "Ref": "DefaultAdminUsername" },
                "default_admin_password": { "Ref": "DefaultAdminPassword" },
                "timeout_interval": "120",
                "api_url": { "Fn::Join": [".", ["https://api", { "Ref": "AWS::StackName" }, "doxly.com"]] },
                "api_debug_mode": false,
                "temp_dir": "storage/tempdir",
                "closing_books_dir": "storage/closing-books",
                "signature_management_dir": "storage/signature-management",
                "hdd_storage_dir": "storage/hdd-storage",
                "checklist_exports_dir": "storage/checklist-exports",
                "docusign_integrator_key": { "Ref": "DocusignIntegratorKey"},
                "docusign_is_demo": true,
                "java_home_path": { "Ref": "JavaHomePath" },
                "cloudconvert_api_key": { "Ref": "CloudConvertAPIKey" },
                "net_documents_us_client_id": "AP-7HB3L2AJ",
                "net_documents_eu_client_id": "AP-I3A7MWGX",
                "net_documents_au_client_id": "AP-9BQUFXGG",
                "net_documents_us_client_secret": "XgFcr0McF6h2owb0npcRl6d2OdQz6ToxsdncCUE6mLltFO2i",
                "net_documents_eu_client_secret": "K5Eqo42rtWk92NYwpDj2MArODDWFEl9DCzhe77NOy5gvEhd3",
                "net_documents_au_client_secret": "JfuM1Wwx9zpHyGxpM2PbhYnOH3HAcUWqQH2ZbVCHHhvt9S2K",
                "minimum_document_retention_minutes_duration": { "Ref": "MinimumDocumentRetentionMinutesDuration" },
                "net_documents_us_api_url": { "Ref": "NetDocumentsUSApiUrl" },
                "net_documents_eu_api_url": { "Ref": "NetDocumentsEUApiUrl" },
                "net_documents_au_api_url": { "Ref": "NetDocumentsAUApiUrl" },
                "net_documents_api_version_number": { "Ref": "NetDocumentsApiVersionNumber" },
                "net_documents_us_login_base_url": { "Ref": "NetDocumentsUSLoginBaseUrl" },
                "net_documents_eu_login_base_url": { "Ref": "NetDocumentsEULoginBaseUrl" },
                "net_documents_au_login_base_url": { "Ref": "NetDocumentsAULoginBaseUrl" },
                "net_documents_hdd_storage_dir": "storage/tempdir/net-documents",
                "see_unity_imanage_api_version_number": "1",
                "see_unity_imanage_hdd_storage_dir": "storage/tempdir/see-unity-imanage",
                "otp_secret_encryption_key": { "Ref": "OtpSecretEncryptionKey" },
                "non_sso_subdomains": ['app'],
                "imanage10_api_version_number": '2',
                "imanage10_hdd_storage_dir": "storage/tempdir/imanage-10",
                "aws_qa_efs_mount_path": "fs-b31996f8.efs.us-east-1.amazonaws.com",
                "aws_demo_efs_mount_path": ""
              },
              "secrets_yml": {
                "secret_key_base": { "Ref": "ProdSecretKeybase" }
              },
              "symlink_before_migrate": {
                "assets": "public/assets"
              },
              "authorized_keys": [
              ]
            }
          }
        },
        "DefaultInstanceProfileArn" : {"Fn::GetAtt" : ["opsworksinstanceprofile", "Arn"] },
        "DefaultOs" : "Ubuntu 14.04 LTS",
        "DefaultSshKeyName" : { "Ref": "KeyName" },
        "DefaultSubnetId" : { "Ref": "subnetregion1" },
        "HostnameTheme" : "Layer_Dependent",
        "Name" : { "Ref": "AWS::StackName" },
        "ServiceRoleArn" : { "Ref": "ServiceRoleArn" },
        "UseCustomCookbooks" : true,
        "UseOpsworksSecurityGroups" : true,
        "VpcId" : { "Ref": "vpc" }
      }
    },
    "railslayer": {
      "Type": "AWS::OpsWorks::Layer",
      "Properties": {
        "Attributes" : {
          "RubyVersion": "2.3",
          "RailsStack": "apache_passenger",
          "PassengerVersion": "5.0.29",
          "RubygemsVersion": "2.6.13",
          "ManageBundler": "true",
          "BundlerVersion": "1.16.4"
        },
        "AutoAssignElasticIps" : false,
        "AutoAssignPublicIps" : false,
        "CustomRecipes" : {
          "Configure": [
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "doxly::config_yml",
            "doxly::secrets_yml",
            "doxly::cron_jobs"
          ],
          "Deploy": [
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "doxly::mount_efs",
            "doxly::asset_compile",
            "doxly::cron_jobs"
          ],
          "Setup": [
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "doxly::clamav",
            "doxly::chrome_headless",
            "doxly::misc_packages",
            "doxly::windows_fonts"
          ],
          "Shutdown": [],
          "Undeploy": []
        },
        "CustomSecurityGroupIds" : [
          { "Ref": "sgdefault" }
        ],
        "EnableAutoHealing" : true,
        "InstallUpdatesOnBoot" : true,
        "Name" : "Rails App Server",
        "Packages" : [
          "libbz2-dev",
          "build-essential",
          "libpq-dev",
          "libpq5",
          "libfontconfig1",
          "libfontconfig1-dev",
          "imagemagick"
        ],
        "Shortname" : "rails-app",
        "StackId" : { "Ref": "opsworksstack" },
        "Type" : "rails-app"
      }
    },
    "workerlayer": {
      "Type": "AWS::OpsWorks::Layer",
      "Properties": {
        "Attributes" : {
          "RubyVersion": "2.3",
          "RailsStack": "apache_passenger",
          "PassengerVersion": "5.0.29",
          "RubygemsVersion": "2.6.13",
          "ManageBundler": "true",
          "BundlerVersion": "1.16.4"
        },
        "AutoAssignElasticIps" : false,
        "AutoAssignPublicIps" : false,
        "CustomRecipes" : {
          "Configure": [
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "rails::configure",
            "doxly::config_yml",
            "doxly::secrets_yml",
            "doxly::cron_jobs"
          ],
          "Deploy": [
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "deploy::rails",
            "doxly::mount_efs",
            "doxly::asset_compile",
            "doxly::worker"
          ],
          "Setup": [
            "opsworks_agent_monit",
            "doxly::sudo_user",
            "doxly::deploy_user_ssh_authorized",
            "ruby",
            "doxly::postgresql_client",
            "doxly::clamav",
            "doxly::chrome_headless",
            "doxly::misc_packages",
            "doxly::windows_fonts"
          ],
          "Shutdown": [],
          "Undeploy": [
            "deploy::rails_undeploy"
          ]
        },
        "CustomSecurityGroupIds" : [
          { "Ref": "sgdefault" }
        ],
        "EnableAutoHealing" : true,
        "InstallUpdatesOnBoot" : true,
        "Name" : "Worker Server",
        "Packages" : [
          "libbz2-dev",
          "build-essential",
          "libpq-dev",
          "libpq5",
          "libfontconfig1",
          "libfontconfig1-dev",
          "imagemagick"
        ],
        "Shortname" : "worker",
        "StackId" : { "Ref": "opsworksstack" },
        "Type" : "custom"
      }
    },
    "doxlyapp": {
      "Type": "AWS::OpsWorks::App",
      "Properties": {
        "AppSource" : {
          "Type": "git",
          "Url": { "Ref": "ApplicationRepo" },
          "SshKey": { "Ref": "ApplicationKey" },
          "Revision": { "Ref": "ApplicationRevision" }
        },
        "Attributes" : {
          "RailsEnv": "production",
          "AutoBundleOnDeploy": "true",
          "DocumentRoot": "public"
        },
        "Name" : { "Ref": "ApplicationName" },
        "Shortname" : { "Ref": "ApplicationName" },
        "StackId" : { "Ref": "opsworksstack" },
        "Type" : "rails"
      }
    }
  },
  "Outputs" : {
      "VPC" : {
        "Value" : { "Ref" : "vpc" }
      },
      "SubnetId" : {
        "Value" : { "Ref" : "subnetregion1" }
      },
      "Database": {
        "Value" : { "Fn::Join" : [ ":", [ { "Fn::GetAtt" : [ "doxlyrds", "Endpoint.Address" ]}, { "Fn::GetAtt" : [ "doxlyrds", "Endpoint.Port" ]} ] ] }
      },
      "DefaultSecurityGroup" : {
        "Value" : { "Ref": "sgdefault" }
      },
      "S3UploadBucket": {
        "Value" : { "Ref": "s3uploadbucket" }
      },
      "AccessKey": {
        "Value" : { "Ref": "appkey" }
      },
      "DeployKey": {
        "Value" : { "Ref": "deploykey" }
      },
      "SecretAccessKey": {
        "Value" : { "Fn::GetAtt" : [ "appkey", "SecretAccessKey" ]}
      },
      "DeploySecretAccessKey": {
        "Value" : { "Fn::GetAtt" : [ "deploykey", "SecretAccessKey" ]}
      },
      "NATIP": {
        "Value" : { "Ref": "NATEIP" }
      },
      "NATDNS": {
        "Value" : { "Ref" : "gwrecord" }
      }
  }
}
