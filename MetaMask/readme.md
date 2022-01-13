# MetaMask

Sub-project that has to be Node.js project because MetaMask's libraries mandate using browserify.

## Bundle

The reason for putting bundle in this same folder is a bug in Browserify.
When it builds a Source Map, it always lists paths relative to the root of node.js project, not relative to the location of the outputted bundle.
