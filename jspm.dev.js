SystemJS.config({
  map: {
    "tsc": "npm:tsc@1.20150623.0",
    "typescript": "npm:typescript@1.8.10",
    "readline": "github:jspm/nodelibs-readline@0.2.0-alpha",
    "plugin-typescript": "github:frankwallis/plugin-typescript@5.2.9",
    "child_process": "github:jspm/nodelibs-child_process@0.2.0-alpha",
    "module": "github:jspm/nodelibs-module@0.2.0-alpha",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha"
  },
  packages: {
    "npm:tsc@1.20150623.0": {
      "map": {}
    },
    "npm:typescript@1.8.10": {
      "map": {}
    },
    "github:frankwallis/plugin-typescript@5.2.9": {
      "map": {
        "typescript": "npm:typescript@2.1.1"
      }
    },
    "npm:typescript@2.1.1": {
      "map": {
        "source-map-support": "npm:source-map-support@0.4.6"
      }
    },
    "npm:source-map-support@0.4.6": {
      "map": {
        "source-map": "npm:source-map@0.5.6"
      }
    }
  }
});
