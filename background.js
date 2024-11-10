let activeTabId = null;
let activeTabStartTime = null;
let timeSpent = {};
chrome.storage.local.get("timeSpent", (result) => {
  if (result.timeSpent) {
    timeSpent = result.timeSpent;
    console.log("Data loaded from storage:", timeSpent);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTimeSpent();
  activeTabId = activeInfo.tabId;
  activeTabStartTime = Date.now();
  console.log("Tab activated:", activeInfo.URL);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    activeTabStartTime = Date.now();
    console.log("Tab updated and time reset for:", tabId);
  }
});

async function updateTimeSpent() {
  if (activeTabId !== null && activeTabStartTime !== null) {
    const timeSpentOnTab = (Date.now() - activeTabStartTime) / 1000;
    const tabUrl = await getTabUrl(activeTabId);
    if (tabUrl) {
      timeSpent[tabUrl] = (timeSpent[tabUrl] || 0) + timeSpentOnTab;
      chrome.storage.local.set({ timeSpent });
    }
    activeTabStartTime = Date.now();
  }
}

async function getTabUrl(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    return new URL(tab.url).hostname;
  } catch (error) {
    console.error(`Failed to get URL for tab ID ${tabId}:`, error);
    return null;
  }
}
setInterval(updateTimeSpent, 500);
