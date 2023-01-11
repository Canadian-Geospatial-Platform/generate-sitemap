#!/bin/bash

lambda_name="generate-sitemap"

zip -r function.zip . -x "*.zip*" -x "out" 
aws lambda update-function-code --function-name $lambda_name --zip-file fileb://function.zip
rm function.zip