let activeTabId = null;
let activeTabStartTime = null;
const timeSpent = {};

// Periodically save timeSpent data to local storage every 5 seconds
setInterval(() => {
  chrome.storage.local.set({ timeSpent });
  console.log("Data periodically saved to storage:", timeSpent);
}, 5000);

// Listener for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTimeSpent(); 
  activeTabId = activeInfo.tabId; 
  activeTabStartTime = Date.now(); 
  console.log("Tab activated:", activeTabId);
});

// Listener for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    activeTabStartTime = Date.now();
    console.log("Tab updated and time reset for:", tabId);
  }
});

// Function to update time spent on the currently active tab
async function updateTimeSpent() {
  if (activeTabId !== null && activeTabStartTime !== null) {
    const timeSpentOnTab = (Date.now() - activeTabStartTime) / 1000; 
    const tabUrl = await getTabUrl(activeTabId);

    if (tabUrl) {
      timeSpent[tabUrl] = (timeSpent[tabUrl] || 0) + timeSpentOnTab;
      console.log("Time updated for", tabUrl, ":", timeSpent[tabUrl]);
    }
    activeTabStartTime = Date.now();
  }
}

// Helper function to get the current tab URL
async function getTabUrl(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId); // Get the tab information
    return new URL(tab.url).hostname; // Return the hostname from the URL
  } catch (error) {
    console.error(`Failed to get URL for tab ID ${tabId}:`, error);
    return null; // Return null if there was an error
  }
}
