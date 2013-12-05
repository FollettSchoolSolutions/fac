var PhantomJasmineRunner, address, page, runner, fs = require('fs');
PhantomJasmineRunner = (function() {

  function PhantomJasmineRunner(page, exit_func) {
    this.page = page;
    this.exit_func = exit_func != null ? exit_func : phantom.exit;
    this.tries = 0;
    this.max_tries = 10;
  }

  PhantomJasmineRunner.prototype.get_status = function() {
    return this.page.evaluate(function() {
      return console_reporter.status;
    });
  };
  /**
   * Takes the page html and writes it to a file on the file system
   */
  PhantomJasmineRunner.prototype.writeOutput = function() {
      var pageContent = page.evaluate(function () {
          return document.getElementById('HTMLReporter').outerHTML;
      });
      var content = '<html>';
      content += '<head> <link rel="stylesheet" href="test/lib/jasmine/jasmine.css"></head>';
      content += pageContent;
      content += "</html>";
      fs.write('./testresults.html', content, 'w');
  };
  
  PhantomJasmineRunner.prototype.terminate = function() {
    this.writeOutput();
    switch (this.get_status()) {
      case "success":
        return this.exit_func(0);
      case "fail":
        return this.exit_func(1);
      default:
        return this.exit_func(2);
    }
  };

  return PhantomJasmineRunner;

})();

if (phantom.args.length === 0) {
  console.log("Need a url as the argument");
  phantom.exit(1);
}

page = new WebPage();

runner = new PhantomJasmineRunner(page);

page.onConsoleMessage = function(msg) {
  console.log(msg);
  if (msg === "ConsoleReporter finished") {
    return runner.terminate();
  }
};

address = phantom.args[0];

page.open(address, function(status) {
  if (status !== "success") {
    console.log("can't load the address!");
    return phantom.exit(1);
  }
});
