workflow "Publish new Demo" {
  on = "push"
  resolves = [
    "Install Packages",
    "Publish Demo",
  ]
}

action "Install Packages" {
  uses = "actions/npm@6309cd9"
  runs = "npm install"
}

action "Publish Demo" {
  uses = "actions/npm@6309cd9"
  needs = ["Install Packages"]
  runs = "npm run publish-demo"
}
