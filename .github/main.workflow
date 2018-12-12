workflow "Publish new Demo" {
  on = "push"
  resolves = [
    "Install Packages",
    "Install Build",
    "Publish Demo",
  ]
}

action "Install Packages" {
  uses = "actions/npm@6309cd9"
  runs = "npm install"
}

action "Install Build" {
  needs = ["Install Packages"]

action "Publish Demo" {
  uses = "actions/npm@6309cd9"
  needs = ["Install Build", "Install Packages"]
  runs = "npm run publish-demo"
}
