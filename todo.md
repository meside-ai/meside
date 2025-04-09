todo:
[x] investigate traefik instead of nginx
[x] use nginx or other proxy server in docker-compose.yml
[x] automatically migrate database
[x] guide user to register a account
[x] automatically initialize a organization and agent for users
[ ] add org creation page to call the api of creating org
[ ] simplify the project to remove orgId
    * advantage: it's easy for database maintain
    * disadvantage: couldn't implements network effect, if we'd like to implements network effect in feature, we should add instances management feature, it's not fit for us
    * action: support tenant firstly, and update unique to composite unique with orgId. Supabase is a database management so it natively requires multiple instances
[ ] update github actions
[ ] remove docs Dockerfile
[ ] update README.md
[ ] add health api to check auth security
