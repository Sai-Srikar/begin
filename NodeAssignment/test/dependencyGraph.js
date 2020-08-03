var dependency={
    "shopifyConnection": {
      "hasDependencyOn": []
    },
    "export-shopify-customers": {
      "hasDepedencyOn": [
        "shopifyConnection"
      ]
    },
    "import-salesforce-customers": {
      "hasDepedencyOn": [
        "salesforceConnection"
      ]
    },
    "salesforceConnection": {
      "hasDependencyOn": []
    }
  }