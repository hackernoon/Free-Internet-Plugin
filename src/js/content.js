
blocklist.content = {};

const zingers = [
  `NATURE IS HEALING: This paywalled site has been removed from your search results.`,
  `YOU. SHALL. NOT. PASS. (THIS PAYWALL)`,
  `Four legs good, paywalls bad.`,
  `ONE DOES NOT SIMPLY SUPPORT PAYWALLS`,
  `Paywalls, so cheugy right now.`,
  `YOU GET A PAYWALL! YOU GET A PAYWALL! EVERY. BODY. GETS A PAYWALL!`,
  `Paywalls, so cheugy right now.`
]

const memes = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image5.jpg",
  "image4.png",
  "image6.png"
]

function getRand(len) {
  return (
    Math.floor(Math.random() * len))
}

blocklist.content.blocklist = [];

blocklist.content.mutationObserver = null;

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
  let left = document.createElement('div');
  left.style.cssText = "display: flex; flex-direction: column; justify-content: space-around; padding-left: 10px;"
  showMessage.style.cssText = 'font-size:15px;background:#00FF00;box-sizing:border-box; display: flex; justify-content: space-between; margin: 20px 0; height: 98px;';
  left.innerHTML = `${zingers[getRand(zingers.length)]}`;
  let image = document.createElement("div")
  image.innerHTML = `<img src=${chrome.runtime.getURL(`images/memes/${memes[getRand(memes.length)]}`)} style="height: 98px; width: auto;">`

  let cancelMessage = document.createElement('div');
  cancelMessage.classList.add("cancleBlock");
  cancelMessage.style.cssText = "cursor: pointer; font-size:16px;font-weight: 700; color: #0066c0;";
  cancelMessage.innerHTML = `undo ${pattern}`
  cancelMessage.addEventListener("click", function (e) {
    blocklist.content.removePatternFromBlocklists(pattern);
    blocklist.content.removeBlockMessage(e.target.parentNode.parentNode);
  }, false);
  left.appendChild(cancelMessage);
  showMessage.appendChild(left);
  showMessage.appendChild(image);
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
  var searchResultPatterns = document.querySelectorAll("div.g");

  for (let i = 0, length = searchResultPatterns.length; i < length; i++) {
    var searchResultPattern = searchResultPatterns[i];
    var searchResultHostLink = searchResultPattern.querySelector("div.yuRUbf > a");
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
  insertLink.innerHTML = `report ${hostlink}`;
  insertLink.style.cssText =
    "margin:0;text-decoration: none;cursor: pointer;";
  searchResult.appendChild(insertLink);

  insertLink.addEventListener("click", function () {
    blocklist.content.addBlocklistFromSearchResult(hostlink, searchResult);
  }, false);
};

blocklist.content.modifySearchResults = function (parent_dom) {


  var searchResultPatterns = parent_dom.querySelectorAll("div.g");

  for (let i = 0, length = searchResultPatterns.length; i < length; i++) {
    var searchResultPattern = searchResultPatterns[i];
    var searchResultHostLink = searchResultPattern.querySelector("div.yuRUbf > a");
    if (searchResultHostLink) {
      var HostLinkHref = searchResultHostLink.getAttribute("href");
      var HostLinkPattern = blocklist.background.getHostNameFromUrl(HostLinkHref);

      if (blocklist.content.isHostLinkInBlocklist(HostLinkPattern)) {
        searchResultPattern.style.display = "none";
        chrome.runtime.sendMessage("updateCounter")
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
