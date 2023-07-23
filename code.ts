import gamutConversion from "clipboard-colorspace-conversion"




const ui = {
  log: (message: string, options: Omit<NotificationOptions, "error"> = {timeout: 2000}) => {
    let n: NotificationHandler;
    const prom = new Promise<NotifyDequeueReason>((res) => {
      n = figma.notify(message, {...options, onDequeue: res});  
    }) as Promise<NotifyDequeueReason> & {cancel: () => void}
    prom.cancel = () => {n.cancel()}
    return prom;
  },
  error: (message: string, options: Omit<NotificationOptions, "error" | "onDequeue"> = {timeout: 2000}) => {
    let n: NotificationHandler;
    const prom = new Promise<NotifyDequeueReason>((res) => {
      n = figma.notify(message, {...options, error: true, onDequeue: res});  
    }) as Promise<NotifyDequeueReason> & {cancel: () => void}
    prom.cancel = () => {n.cancel()}
    return prom;
  }
};




(async () => {
  if (figma.editorType === "figma") {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) {
      await ui.error("Please select a single node as root")
    }
    else {
      const elem = selection[0];
      if ("fills" in elem && "color" in (elem as any).fills[0]) {
        if ((elem as any).fills[0].type === "SOLID") {
          const color = (elem as any).fills[0].color;
          console.log(color)
          try {
            const stringified = gamutConversion(`${color.r} ${color.g} ${color.b}`)
            await copyText(stringified)
          } 
          catch(e) {
            console.error(e)
            await ui.error("Failed at color gamut conversion")
            return
          }
          
          
          
        }
        else {
          await ui.error("Please select a node with a solid fill")
        }
        
      }
      else {
        await ui.error("Please select a node with a fill")
      }
    }
    
  }
  // Runs this code if the plugin is run in FigJam
  if (figma.editorType === "figjam") {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
      await ui.error("Please select a single node as root")
    }
    else {
      const elem = selection[0];
      if ("fills" in elem && "color" in (elem as any).fills[0]) {
        const color = (elem as any).fills[0].color;
        console.log(color)
        try {
          const stringified = gamutConversion(`${color.r} ${color.g} ${color.b}`)
          await copyText(stringified)
        } 
        catch(e) {
          console.error(e)
          await ui.error("Failed at color gamut conversion")
          return
        }
      }
      else {
        await ui.error("Please select a node with a fill")
      }
    }
  }

  figma.closePlugin()
})()



async function copyText(stringified: string) {
  try {
    // open window with stringified json inside
    figma.showUI(__html__, { themeColors: true, width: 500, height: 400 })
    figma.ui.postMessage(stringified)

    await new Promise<void>((res, rej) => {
      // wait for message from window
      figma.ui.onmessage = async (msg) => {
        if (msg.type === "copy-success") {
          figma.ui.close()
          await ui.log("Copied to clipboard")
          res()
        }
        else if (msg.type === "copy-fail") {
          rej()
        }

        figma.closePlugin();
      }
    })
  }
  catch(e) {
    await ui.log(stringified);
  }
}