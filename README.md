# ChatScriptSmooch


## Deploy Smooch & a ChatBot on Heroku or Elastic Beanstalk

### Prerequisites

 * You need a bot running with ChatScript on a server (you can use the scripts of ChatScriptDeploy), take note of the host and port and don't forget to authorize requests on your server.

### Step by step

1. First, sign up for a free account at [smooch.io](https://app.smooch.io/signup)

1. With a new Smooch app created, go to the settings tab and take note of your App Token. Also, generate a new Secret Key, and take note of the key ID and secret.

    ![settings](/img_readme/settings.png)

#### Deploy on Heroku

1. Sign up in Heroku and create a new app. Under **Deploy**, connect your app to your github repository which contains your smooch app, here ChatScriptSmooch. You can set the automatic deploys, or do it manually.

1. In *Settings* > *Config Variables*, you'll need to specify your app token, key ID, and secret in the app's `SMOOCH_APP_TOKEN`, `SMOOCH_KEY_ID`, and `SMOOCH_SECRET`.

1. Now you need to connect your bot to Heroku. Specify your `CS_BOT`(= bot name), `CS_HOST` and `CS_PORT`.

1. Your app should now be running on Heroku but you're not quite done yet. Take note of the URL where your heroku app is running, for example `https://foo-bar-4242.herokuapp.com`. You'll need to specify this in your heroku app `SERVICE_URL` config variable. You can do this in the Heroku control panel under **Settings** > **Config Variables**, or if you have the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed you can do it like so:

        $ heroku config:set SERVICE_URL=https://foo-bar-4242.herokuapp.com -a foo-bar-4242

1. In Smooch, your application should be detected. You have to had another integration : WebHooks. There is 2 important types of webhooks we use in this example that you have to add, appUser:messages and Postbacks with the URL of your application.

1. You should be all set. Open your Heroku app and start chatting with your new bot! Use the heroku URL and you should have something like this:

![heroku](/img_readme/heroku.gif)

#### Deploy on Elastic Beanstalk

1. Use the Amazon Web Service named Elastic Beanstalk and create a new application.

1. Create a new environment (server web) running node.js and deploy your zip file. Be careful, the zip file must contain all the files, not a folder.

1. In *configuration* -> *Software configuration*, add the environment variable `SMOOCH_APP_TOKEN`, `SMOOCH_KEY_ID`, and `SMOOCH_SECRET` referring to the Smooch app you created earlier. Add the variables `CS_BOT`(= bot name), `CS_HOST` and `CS_PORT` referring to the server URL and the PORT where your bot is running.

1. Finally, add the WebHooks integration in your Smooch app and configure appUser:messages and Postbacks with the URL of your Elastic Beanstalk application.

1. Opening your application, you should now be able to chat with your bot !
