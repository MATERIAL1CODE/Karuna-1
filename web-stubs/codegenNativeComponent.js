// Empty stub for native-only codegenNativeComponent on web
function codegenNativeComponent() {
  return function() {
    return null;
  };
}

module.exports = codegenNativeComponent;
module.exports.default = codegenNativeComponent;