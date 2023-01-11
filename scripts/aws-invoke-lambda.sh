#!/bin/bash

lambda_name="generate-sitemap"
lambda_payload="file://payload.json"

aws lambda invoke --function-name $lambda_name out --output text --payload $lambda_payload --cli-binary-format raw-in-base64-out