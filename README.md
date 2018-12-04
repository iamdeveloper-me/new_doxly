# README

## Requirement
* Ruby 2.3.0
* Rails 4.2.6
* PostgreSQL Database

## Deployment Steps
#### Install required gems
```
bundle install
```
#### Set up your configuration
```
cp config/config.example.yml config/config.yml
cp config/database.example.yml config/database.yml
cp config/secrets.example.yml config/secrets.yml
```
Edit the above 3 files and update them with your info/credentials. Use 'rake secret' for your secrets.
#### Create Database
```
rake db:create
```
#### Run Migrations
```
rake db:migrate
```
#### Run Seed data file
```
rake db:seed
```
#### Run the server
```
cd ..
```
```
foreman start -f Procfile.dev
```

## Things you need to know
If you are working with emails in development, you'll want to use Mailcatcher (development.rb settings are already set up for it). Install and view documentation here: https://mailcatcher.me/

## More resources
For more clarity, you can read the [onboarding wiki page](https://github.com/doxly-inc/doxly/wiki/Onboarding). That document will go into more detail about how exactly to set up your development environment and get the Doxly app up and running.
