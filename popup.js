document.addEventListener('DOMContentLoaded', function() {

    var currentURL = document.getCurrentURL()
    var urlelement = document.getElementById('current-url')
    urlelement.innerText = urlelement
    // Variables to store the captured elements
    var capturedElements = [];
    
    // Start button click event handler
    var startButton = document.getElementById('start-button');
    startButton.disabled = false;
    startButton.addEventListener('click', function() {
      // Enable the start button and disable the stop button
      startButton.disabled = true;
      stopButton.disabled = false;
  
      // Add event listener for element clicks
      document.addEventListener('click', handleElementClick);
    });
  
    // Stop button click event handler
    var stopButton = document.getElementById('stop-button');
    stopButton.disabled = true;
    stopButton.addEventListener('click', function() {
      // Disable the stop button and enable the start button
      stopButton.disabled = true;
      startButton.disabled = false;
  
      // Remove the event listener for element clicks
      document.removeEventListener('click', handleElementClick);
  
      // Save the captured elements to a JSON file
      saveDataToJSON(capturedElements);
    });
  
    // Event handler for element clicks
    function handleElementClick(event) {
      event.preventDefault();
      event.stopPropagation();
  
      // Get the target element and its details
      var element = event.target;
      var elementData = getElementData(element);
  
      // Add the element data to the captured elements array
      capturedElements.push(elementData);
  
      // Create a new row in the table to display the element data
      createTableRow(elementData);
    }
  
    // Extract the relevant data for an element
    function getElementData(element) {
      var title = element.tagName.toLowerCase();
      var boundingBox = element.getBoundingClientRect();
      var center = {
        x: boundingBox.left + boundingBox.width / 2,
        y: boundingBox.top + boundingBox.height / 2
      };
      var selectors = {
        css: getCSSSelector(element),
        xpath: getXPathSelector(element)
      };
      var elementType = element.type || '';
      var id = element.id || '';
      var className = element.className || '';
  
      return {
        title: title,
        boundingBox: boundingBox,
        center: center,
        selectors: selectors,
        elementType: elementType,
        id: id,
        className: className
      };
    }
  
    // Create a table row to display the element data
    function createTableRow(elementData) {
      var tableBody = document.getElementById('element-table');
      var newRow = document.createElement('tr');
  
      // Create table cells for each data field
      var titleCell = createTableCell(elementData.title, true);
      var boundingBoxCell = createTableCell(JSON.stringify(elementData.boundingBox));
      var centerCell = createTableCell(JSON.stringify(elementData.center));
      var cssSelectorCell = createTableCell(elementData.selectors.css);
      var xpathSelectorCell = createTableCell(elementData.selectors.xpath);
      var elementTypeCell = createTableCell(elementData.elementType);
      var idCell = createTableCell(elementData.id);
      var classCell = createTableCell(elementData.className);
  
      // Append the table cells to the new row
      newRow.appendChild(titleCell);
      newRow.appendChild(boundingBoxCell);
      newRow.appendChild(centerCell);
      newRow.appendChild(cssSelectorCell);
      newRow.appendChild(xpathSelectorCell);
      newRow.appendChild(elementTypeCell);
      newRow.appendChild(idCell);
      newRow.appendChild(classCell);
  
      // Append the new row to the table body
      tableBody.appendChild(newRow);
    }
  
    // Create a table cell element with the provided text content
    function createTableCell(content, editable = false) {
      var cell = document.createElement('td');
      if (editable) {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = content;
        cell.appendChild(input);
      } else {
        cell.textContent = content;
      }
      return cell;
    }
  
    // Save the captured elements to a JSON file
    function saveDataToJSON(data) {
      var json = JSON.stringify(data, null, 2);
  
      // Retrieve the user-specified folder and file name
      var folderInput = document.getElementById('folder-input');
      var filenameInput = document.getElementById('filename-input');
      var folderPath = folderInput.value;
      var filename = filenameInput.value || getCurrentURL() + '.json';
  
      // Create a blob from the JSON data
      var blob = new Blob([json], { type: 'application/json' });
  
      // Generate a URL for the blob
      var url = URL.createObjectURL(blob);
  
      // Create a link element to trigger the download
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
  
      // Simulate a click on the link to start the download
      link.click();
  
      // Clean up the URL object
      URL.revokeObjectURL(url);
  
      // Clear the captured elements array and table
      capturedElements = [];
      clearTable();
    }
  
    // Clear the table body
    function clearTable() {
      var tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';
    }
  
    // Get the current URL of the active tab
    function getCurrentURL() {
      return new Promise(function(resolve, reject) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs && tabs.length > 0) {
            resolve(tabs[0].url);
          } else {
            reject(new Error('Unable to retrieve the current URL.'));
          }
        });
      });
    }
  
    // Get the CSS selector for an element
    function getCSSSelector(element) {
      var path = [];
      while (element.parentNode) {
        if (element.id) {
          path.unshift('#' + element.id);
          break;
        } else {
          var elementTagName = element.tagName.toLowerCase();
          var elementIndex = Array.from(element.parentNode.children).indexOf(element) + 1;
          path.unshift(elementTagName + ':nth-child(' + elementIndex + ')');
          element = element.parentNode;
        }
      }
      return path.join(' > ');
    }
  
    // Get the XPath selector for an element
    function getXPathSelector(element) {
      var path = [];
      while (element && element.nodeType === Node.ELEMENT_NODE) {
        var elementTagName = element.tagName.toLowerCase();
        var elementIndex = getElementIndex(element);
        path.unshift(elementTagName + '[' + elementIndex + ']');
        element = element.parentNode;
      }
      return path.join('/');
    }
  
    // Get the index of an element among its siblings
    function getElementIndex(element) {
      var index = 1;
      while (element.previousElementSibling) {
        element = element.previousElementSibling;
        if (element.nodeType === Node.ELEMENT_NODE) {
          index++;
        }
      }
      return index;
    }
  });
  