workflow "Publish new Demo" {
  on = "push"
  resolves = ["Install Packages", "npm run publish-demo"]
}

action "Install Packages" {
  uses = "actions/npm@6309cd9"
  runs = "npm install"
}

action "npm run publish-demo" {
  uses = "actions/npm@6309cd9"
  needs = ["Install Packages"]
}
