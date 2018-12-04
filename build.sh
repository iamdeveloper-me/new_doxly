#!/bin/bash

echo "This may take several minutes, please be patient"
bundle install
rake db:migrate
cd app/frontend
npm install
npm run build
cd ../..
