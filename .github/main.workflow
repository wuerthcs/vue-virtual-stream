workflow "Publish new Demo" {
  on = "push"
  resolves = [
    "Publish Demo"
  ]
}

action "Publish Demo" {
  uses = "actions/npm@6309cd9"
  runs = "npm run full-publish"
}