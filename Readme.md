Using Node 16/latest

Install

```sh
npm install
```

Then start services

```sh
npm run start-services
```

Then start the gateway in another terminal

```sh
npm run start-gateway
```

Then open http://localhost:4000

Verify you can run this query:

```
query Me {
  me {
    id
    name
  }
}
```

Now open `services/new/index.js` and update the typedefs to add:

```
  extend type Member @key(fields: "id") {
    id: ID! @external
    name: String
  }
```

According to [the documentation](https://www.apollographql.com/docs/federation/entities/#field-migration)
the service that defines a field _last_ should continue to resolve it. Instead,
the gateway raises a composition error:

> This data graph is missing a valid configuration. [new] Member.name -> Field "Member.name" already exists in the schema. It cannot also be defined in this type extension. If this is meant to be an external field, add the `@external` directive.

If you run the same query again in the playground, the whole query errors out:

    "message": "This data graph is missing a valid configuration. More details may be available in the server logs."

Using this local demo I am unable to validate the claim the docs make that apollo server gracefully handles field conflicts