#!/bin/bash

lambda_name="generate-sitemap"

aws logs tail "/aws/lambda/$lambda_name" --follow
