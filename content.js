alterTableRows = (parent) => {
  var table_rows = parent.getElementsByTagName('tr');
  for (let i = 0; i < table_rows.length; i++) {
    if(table_rows[i].firstElementChild) {
      let element = table_rows[i].classList
      const firstChild = table_rows[i].firstElementChild.classList

      // for deleted rows
      if (firstChild.contains('blob-num-deletion') && !element.contains('collapse-deleted-rows')) {
        element.add('collapse-deleted-rows')
      } else {
        element.remove('collapse-deleted-rows')
      }

      // for added rows
      if (firstChild.contains('blob-num-addition') && !element.contains('unhighlight-added-rows')) {
        element.add('unhighlight-added-rows')
      } else {
        element.remove('unhighlight-added-rows')
      }
    }
  }
}

InjectToggleButton = (expandable_files) => {
  // var expandable_files = document.getElementsByClassName('file-header--expandable')
  for (let i = 0; i < expandable_files.length; i++) {
    try {
      let file_actions = expandable_files[i].getElementsByClassName('file-actions')[0]

      // make sure file_actions exists and toggle button does not
      if(file_actions && !file_actions.children[1].classList.contains('exists')) {
        let toggleButton = document.createElement("a")
        file_actions.children[1].classList.forEach(
          function(value) {
            toggleButton.classList.add(value)
          }
        )
        toggleButton.classList.add('exists')
        toggleButton.innerText = 'Toggle Changes'
        toggleButton.setAttribute('aria-label', 'Toggle the deletion and addition view')

        toggleButton.addEventListener('click', (e) => {
          alterTableRows(expandable_files[i].parentElement);
        })

        if (file_actions.firstChild !== toggleButton) {
          file_actions.insertBefore(toggleButton, file_actions.children[1])
        }
      }
    } catch (e) {
      console.log('Sorry I cannot handle this!\n', e)
    }
  }
}



InjectToggleList = (expandable_files, toggleList) => {
  // var expandable_files = document.getElementsByClassName('file-header--expandable')
  let seenFileExts = []
  let fileExts = []

  let container = document.getElementsByClassName('container')[0]
  if(container.firstElementChild.className !== toggleList.className) {
    container.insertBefore(toggleList, container.firstElementChild)
  }

  for (let i = 0; i < expandable_files.length; i++) {
    try {
      let file_info = expandable_files[i].getElementsByClassName('file-info')[0]
      
      if(file_info && file_info.getElementsByTagName("a")) {
        file_info.getElementsByTagName("a")[0].innerText.split('.').forEach(
          function(value, index, array) {
            if (index === array.length - 1){
              expandable_files[i].parentElement.classList.add(value)

              if(!seenFileExts.includes(value)) {
                listItem = document.createElement("span")
                checkbox = document.createElement("input")
                checkbox.setAttribute("type", "checkbox")
                checkbox.checked = true
                checkbox.id = value
                checkbox.addEventListener('click', (e) => {
                  let file_actions = expandable_files[i].getElementsByClassName('file-actions')[0]
                  
                  if (file_actions.getElementsByTagName('button')[0].getAttribute('aria-expanded')) {
                    
                    file_actions.getElementsByTagName('button')[0].setAttribute('aria-expanded', 'false')
                  } else {
                    file_actions.getElementsByTagName('button')[0].setAttribute('aria-expanded', 'true')
                  }

                  expandables = document.getElementsByClassName(value)
                  for(let j = 0; j < expandables.length; j++){
                    if(expandables[j].classList.contains("open") || expandables[j].classList.contains("Details--on")) {
                      expandables[j].classList.remove("open")
                      expandables[j].classList.remove("Details--on")
                    } else {
                      expandables[j].classList.add("open")
                      expandables[j].classList.add("Details--on")
                    }
                  }
                })

                text = document.createElement("span")
                text.className = "file-ext-list-item-text"
                if(array.length === 1) {
                  text.innerText = value
                } else {
                  text.innerText = '.' + value
                }

                listItem.appendChild(checkbox)
                listItem.appendChild(text)
                listItem.className = "file-ext-list-item"
                seenFileExts = seenFileExts.concat(value)
                fileExts = fileExts.concat(listItem)
              }
            }
          }
        )
      }
    } catch (e) {
      console.log('Sorry I cannot handle this!\n', e)
    }
  }
  fileExts.forEach(
    function(newItem) {
      let addItem = true;
      if(toggleList.children) {
        for(let i = 0; i < toggleList.children.length; i++) {
          if(toggleList.children[i].firstChild.id === newItem.firstChild.id) {
            addItem = false
            break
          }
        }
      }
      if(addItem) {
        toggleList.appendChild(newItem)
      }
    }
  )
}

let toggleList = document.createElement("div")
toggleList.className = 'file-ext-list'
header = document.createElement("span")
header.className = "file-ext-list-header"
header.innerText = "Show files:"
toggleList.appendChild(header)

main = () => {
  var expandable_files = document.getElementsByClassName('file-header--expandable')
  InjectToggleButton(expandable_files)
  InjectToggleList(expandable_files, toggleList)
}

main()

// hacky way to update when new folders load

setTimeout(function(){main()}, 1000)
setInterval(function(){main()}, 10000)