#!/bin/bash

lambda_name="load-s3-data-to-opensearch"

aws logs tail "/aws/lambda/$lambda_name" --follow
