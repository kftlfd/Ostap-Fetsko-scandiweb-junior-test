This is an attemt to create a single-page-application frontend in vanilla JS (+TS).

To try, place dist files (build if needed) in backend folder and start backend containers: from project's root run

```
$ docker compose up -d
```

For v4 you can run `yarn dev` to launch Vite devserver (but you still have to start backend).

For v5 build the nodes lib first: in `nodes` dir run `yarn` and `yarn build`. After that in `v5` dir run `yarn dev`.
