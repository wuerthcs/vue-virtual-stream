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

action "Install Packages for Build" {
  uses = "actions/npm@6309cd9"
  runs = "cd ./demo && npm install"
  needs = ["Install Packages"]
}

action "Publish Demo" {
  uses = "actions/npm@6309cd9"
  needs = ["Install Packages for Build", "Install Packages"]
  runs = "npm run publish-demo"
}
