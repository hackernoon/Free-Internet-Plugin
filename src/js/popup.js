blocklist.popup = {};

blocklist.popup.handleDeleteBlocklistResponse = function (response) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'refresh'
    });
  })
};

blocklist.popup.handleAddBlocklistResponse = function (response) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'refresh'
    });
  })
};

blocklist.popup.createBlocklistPattern = function (pattern) {
  let patRow = $(
    '<div style="max-width:350px;white-space: nowrap;display:flex;font-size:16px;margin:10px 0;padding:5px 0;border-bottom:1px solid #f2f2f2;"></div>');
  let patRowDeleteButton = $('<div class="isBlocked" style="margin-right: 15px;"></div>');
  let span = $('<span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">remove</span>');

  patRowDeleteButton.append(span);
  patRowDeleteButton.appendTo(patRow);

  let patRowHostName = $(
    '<div class="pattern-block">' + pattern + '</div>');
  patRowHostName.appendTo(patRow);

  patRowDeleteButton.on("click", function () {
    let btn = $(this);

    if (btn.hasClass("isBlocked")) {
      chrome.runtime.sendMessage({
        type: blocklist.background.DELETE_FROM_BLOCKLIST,
        pattern: pattern
      },
        blocklist.popup.handleDeleteBlocklistResponse);

      btn.removeClass("isBlocked");
      span.html(
        '<span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">block</span>');

    } else {
      chrome.runtime.sendMessage({
        type: blocklist.background.ADD_TO_BLOCKLIST,
        pattern: pattern
      },
        blocklist.popup.handleAddBlocklistResponse);

      btn.addClass("isBlocked");
      span.html(
        '<span style="color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;">remove</span>');

    }
  });
  return patRow;
}

blocklist.popup.handleAddBlocklistResponse = function (response) {
  chrome.runtime.sendMessage({
    type: blocklist.background.GET_BLOCKLIST
  },
    blocklist.popup.handleRefreshResponse);
}

blocklist.popup.hideCurrentHost = function (pattern) {
  chrome.runtime.sendMessage({
    'type': blocklist.background.ADD_TO_BLOCKLIST,
    'pattern': pattern
  },
    blocklist.popup.handleAddBlocklistResponse);
  $("#current-blocklink").html(
    '<p style="background:#dff0d8;color:#3c763d;padding:10px;">blocked</p>');
}

blocklist.popup.addBlockCurrentHostLink = function (blocklistPatterns) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    let pattern = blocklist.background.getHostNameFromUrl(tabs[0].url);

    if (blocklistPatterns.indexOf(pattern) == -1) {
      $('#current-blocklink').html(
        `<a href="#">report current site as paywall</a>`);
      $('#current-blocklink').click(function () {
        blocklist.popup.hideCurrentHost(pattern);
      });
    } else {
      $("#current-blocklink").html(
        `<p style="background:#dff0d8;color:#3c763d;padding:10px;">completely blocked ${pattern}</p>`);
    };
  });
}

blocklist.popup.handleRefreshResponse = function (response) {
  $("#popup-list").show('fast');

  let length = response.blocklist.length,
    listDiv = $('#popup-list');
  listDiv.empty();

  if (response.blocklist != undefined && length > 0) {
    blocklist.popup.addBlockCurrentHostLink(response.blocklist);

    for (let i = 0; i < length; i++) {
      var patRow = blocklist.popup.createBlocklistPattern(response.blocklist[i]);
      patRow.appendTo(listDiv);
    }
    document.getElementById('footer').innerHTML = `We have blocked ${localStorage.totalBlocked} paywalls for you :)`
  } else {
    blocklist.popup.addBlockCurrentHostLink([]);
  }


}

blocklist.popup.refresh = function () {
  chrome.runtime.sendMessage({
    type: blocklist.background.GET_BLOCKLIST
  },
    blocklist.popup.handleRefreshResponse);
};

blocklist.popup.clickImportButton = function () {

  $("#io-head").text('import');

  let submitArea = $("#submit");
  submitArea.off('click');
  submitArea.text("save");
  $("#io-desc").text("Enter URLs you'd like to block");
  $("#io-text").val('');
  submitArea.on("click", function () {
    let pattern = $("#io-text").val();
    blocklist.popup.handleImportButton(pattern);
  });
  $("#io-area").toggleClass('io-area-open');
};


blocklist.popup.handleImportButton = function (pattern) {
  chrome.runtime.sendMessage({
    type: blocklist.background.ADD_LIST_TO_BLOCKLIST,
    pattern: pattern
  },
    blocklist.popup.handleImportButtonResult);
}

blocklist.popup.handleImportButtonResult = function (response) {
  let showMessage = document.createElement('p');
  showMessage.style.cssText = 'background:#dff0d8;color:#3c763d;padding:10px;';
  showMessage.innerHTML = "Blocked:";

  $('#submit').after(showMessage);

  setTimeout(function () {
    showMessage.style.visibility = "hidden";
  }, 1000);

  blocklist.popup.refresh();
}

blocklist.popup.clickExportButton = function () {
  chrome.runtime.sendMessage({
    type: blocklist.background.GET_BLOCKLIST
  },
    blocklist.popup.handleExportButton);
};

blocklist.popup.handleExportButton = function (response) {

  $("#io-head").text("export");

  $('#io-desc').text("copy links you've blocked");
  let ioText = $("#io-text");
  let blocklist = response.blocklist;

  ioText.val('');
  for (let i = 0, length = blocklist.length; i < length; i++) {
    ioText.val(ioText.val() + blocklist[i] + "\n");
  }

  let submitArea = $("#submit");
  submitArea.off('click');
  submitArea.text("copy");
  submitArea.click(function () {
    ioText.select();
    document.execCommand('copy');
  });

  $("#io-area").toggleClass('io-area-open');
}

blocklist.popup.localizeHeader = function () {
  let blockListHeader = $("#blockListHeader");
  blockListHeader.html("blocked URLs:");
}

blocklist.popup.createIoButton = function () {

  let export_btn = $("#export");
  export_btn.text("copy links");
  export_btn.on("click", function () {
    blocklist.popup.clickExportButton();
  });

  let import_btn = $("#import");
  import_btn.text('add URLS');
  import_btn.on("click", function () {
    blocklist.popup.clickImportButton();
  });


}

blocklist.popup.createBackButton = function () {
  $("#back").text("back")
  $("#back").on("click", function () {
    $("#io-area").toggleClass('io-area-open');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  blocklist.popup.refresh();
  blocklist.popup.localizeHeader();
  blocklist.popup.createIoButton();
  blocklist.popup.createBackButton();
});


