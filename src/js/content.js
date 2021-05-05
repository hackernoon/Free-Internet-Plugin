
blocklist.content = {};

blocklist.content.blocklist = [];

blocklist.content.mutationObserver = null;


blocklist.content.SEARCH_RESULT_DIV_BOX = "div.g";

blocklist.content.LINK_TAG = "div.yuRUbf > a";

blocklist.content.handleGetBlocklistResponse = function (response) {
  if (response.blocklist != undefined) {
    blocklist.content.blocklist = response.blocklist;
  }
};

blocklist.content.isHostLinkInBlocklist = function (hostlink) {
  if (blocklist.content.blocklist.indexOf(hostlink) != -1) {
    return true;
  } else {
    return false;
  }
};

blocklist.content.handleAddBlocklistFromSerachResult = function (response) {
  if (response.blocklist != undefined) {
    blocklist.content.blocklist = response.blocklist;
  }
};

blocklist.content.showAddBlocklistMessage = function (pattern, section) {
  let showMessage = document.createElement('div');
  showMessage.style.cssText = 'font-size:15px;background:#0f0;padding:30px;margin:20px 0;box-sizing:border-box;';
  showMessage.innerHTML = `Blocked ${pattern}`;

  let cancelMessage = document.createElement('div');
  cancelMessage.classList.add("cancleBlock");
  cancelMessage.style.cssText = "cursor: pointer;margin-top:20px;font-size:16px;font-weight: 700; color: #0066c0;";
  cancelMessage.innerHTML = `Undo ${pattern}`;
  cancelMessage.addEventListener("click", function (e) {
    blocklist.content.removePatternFromBlocklists(pattern);
    blocklist.content.removeBlockMessage(e.target.parentNode);
  }, false);
  showMessage.appendChild(cancelMessage);
  let parent = section.parentNode;
  parent.insertBefore(showMessage, section);

}

blocklist.content.removeBlockMessage = function (elm) {
  elm.parentNode.removeChild(elm);
}

blocklist.content.removePatternFromBlocklists = function (pattern) {
  chrome.runtime.sendMessage({
    type: blocklist.background.DELETE_FROM_BLOCKLIST,
    pattern: pattern
  }, blocklist.content.handleRemoveBlocklistFromSerachResult);

  blocklist.content.displaySectionsFromSearchResult(pattern);
}

blocklist.content.handleRemoveBlocklistFromSerachResult = function (response) {
  if (response.blocklist != undefined) {
    blocklist.content.blocklist = response.blocklist;
  }
}

blocklist.content.displaySectionsFromSearchResult = function (pattern) {
  blocklist.content.toggleSections(pattern, "block");
}


blocklist.content.deleteSectionsFromSearchResult = function (pattern) {
  blocklist.content.toggleSections(pattern, "none");
};

blocklist.content.toggleSections = function (pattern, display) {
  var searchResultPatterns = document.querySelectorAll(blocklist.content.SEARCH_RESULT_DIV_BOX);

  for (let i = 0, length = searchResultPatterns.length; i < length; i++) {
    var searchResultPattern = searchResultPatterns[i];
    var searchResultHostLink = searchResultPattern.querySelector(blocklist.content.LINK_TAG);
    if (searchResultHostLink) {
      var HostLinkHref = searchResultHostLink.getAttribute("href");
      var sectionLink = HostLinkHref.replace(blocklist.background.HOST_REGEX, '$2');
      if (pattern === sectionLink) {
        searchResultPattern.style.display = display;
      }
    }
  }
}

blocklist.content.addBlocklistFromSearchResult = function (hostlink, searchresult) {
  var pattern = hostlink;
  chrome.runtime.sendMessage({
    type: blocklist.background.ADD_TO_BLOCKLIST,
    pattern: pattern
  },
    blocklist.content.handleAddBlocklistFromSerachResult);
  blocklist.content.deleteSectionsFromSearchResult(pattern);
  blocklist.content.showAddBlocklistMessage(pattern, searchresult);
};

blocklist.content.insertAddBlockLinkInSearchResult = function (searchResult, hostlink) {
  var insertLink = document.createElement('p');
  insertLink.innerHTML = `report ${hostlink} as paywall`;
  insertLink.style.cssText =
    "color:#1a0dab;margin:0;text-decoration:underline;cursor: pointer;";
  searchResult.appendChild(insertLink);

  insertLink.addEventListener("click", function () {
    blocklist.content.addBlocklistFromSearchResult(hostlink, searchResult);
  }, false);
};

blocklist.content.modifySearchResults = function (parent_dom) {


  var searchResultPatterns = parent_dom.querySelectorAll(blocklist.content.SEARCH_RESULT_DIV_BOX);

  for (let i = 0, length = searchResultPatterns.length; i < length; i++) {
    var searchResultPattern = searchResultPatterns[i];
    var searchResultHostLink = searchResultPattern.querySelector(blocklist.content.LINK_TAG);
    if (searchResultHostLink) {
      var HostLinkHref = searchResultHostLink.getAttribute("href");
      var HostLinkPattern = blocklist.background.getHostNameFromUrl(HostLinkHref);

      if (blocklist.content.isHostLinkInBlocklist(HostLinkPattern)) {
        searchResultPattern.style.display = "none";
      } else {
        blocklist.content.insertAddBlockLinkInSearchResult(
          searchResultPattern, HostLinkPattern);
      }
    }
  }
};

blocklist.content.refreshBlocklist = function () {
  chrome.runtime.sendMessage({
    type: blocklist.background.GET_BLOCKLIST
  },
    blocklist.content.handleGetBlocklistResponse);
};

blocklist.content.initMutationObserver = function () {
  if (blocklist.content.mutationObserver != null) return;

  blocklist.content.mutationObserver = new MutationObserver(function (mutations) {
    blocklist.content.modifySearchResultsAdded(mutations);
  });

  const SEARCH_RESULTS_WRAP = "div#center_col";
  let target = document.querySelector(SEARCH_RESULTS_WRAP);
  let config = { childList: true, subtree: true };
  blocklist.content.mutationObserver.observe(target, config);
}

blocklist.content.modifySearchResultsAdded = function (mutations) {
  for (let i = 0; i < mutations.length; i++) {
    let mutation = mutations[i];
    let nodes = mutation.addedNodes;

    if (nodes.length !== 3) continue;

    let div_tag = nodes[1];
    if (div_tag.tagName !== "DIV") continue;

    let new_srp_div = div_tag.parentNode;
    if (!(/arc-srp_([0-9]+)/).test(new_srp_div.id)) continue;

    blocklist.content.modifySearchResults(new_srp_div);
  };
}

blocklist.content.refreshBlocklist();

document.addEventListener("DOMContentLoaded", function () {
  blocklist.content.initMutationObserver();
  blocklist.content.modifySearchResults(document);
}, false);
