//centerPanel
//centerFrame

var ProcessViewJApplet = null;
var ProcessViewJAppletName = "ProcessViewJApplet";
var ProcessViewIFrameName = "ProcessViewIFrame";
var ProcessViewPanelID = "ProcessViewPanel";

var ReportIFrameName = "ReportIFrame";
var ReportPanelID = "ReportPanel";

var ProcessViewJAppletName = "ProcessViewJApplet";

function loadPage(url,title,name) {
    if(Ext.isEmpty(url)){
        return false;
    }else if (url.toLowerCase().indexOf("javascript:") != -1) {
        try {
            eval(url);
        }catch(exception) {
            alert(exception);
        }
        return false;
    }
    // 只运行一个ProcessView实例
    if (url.toLowerCase().indexOf("svg=") != -1) {

        var ProcessViewIFrame = top.frames[ProcessViewIFrameName];

        var ProcessViewPanel = top.Ext.getCmp('centerTabPanel').findById(ProcessViewPanelID);


        if (ProcessViewIFrame == null || ProcessViewPanel == null) {

            top.Ext.getCmp('centerTabPanel').add({
                xtype : 'panel',
                id : ProcessViewPanelID,
                title : title,
                iconCls : 'tabs',
                html : '<iframe src="'
                    + encodeURI(url)
                    + '" id="'
                    + ProcessViewIFrameName
                    + '" name="'
                    + ProcessViewIFrameName
                    + '" align="middle" width="100%" height="100%" marginwidth="0" marginheight="0" frameborder="0" scrolling="no"></iframe>',
                closable : true
            }).show();

        } else {
            ProcessViewJApplet = ProcessViewIFrame.document.applets[ProcessViewJAppletName];

            if (ProcessViewJApplet == null || ProcessViewJApplet.name != ProcessViewJAppletName) {

                ProcessViewPanel.setTitle(title);

                ProcessViewIFrame.location = encodeURI(url);

            } else {

                var tail = url.substring(url.indexOf("svg="));
                var indexofamp = tail.indexOf("&");
                var svgname = "";
                if (indexofamp != -1) {
                    svgname = tail.substring(4, indexofamp);
                } else {
                    svgname = tail.substring(4);
                }

                var scale = "true";
                if(url.indexOf("scale=") != -1){
                    scale = url.substring(url.indexOf("scale="));
                    var indexofamp = scale.indexOf("&");
                    if(indexofamp != -1){
                        scale = scale.substring(6,indexofamp);
                    }else{
                        scale = scale.substring(6);
                    }
                    scale = scale.trim().toLowerCase();
                }

                try{
                    if(scale == 'false'){
                        ProcessViewJApplet.setScale(false);
                    }else{
                        ProcessViewJApplet.setScale(true);
                    }
                }catch(e){
                }


                var successflag = false;

                try{
                    successflag = ProcessViewJApplet.loadSVGFile(svgname);
                }catch(e){
                }

                if(successflag){
                    try{
                        ProcessViewPanel.setTitle(title);
                    }catch(e){
                    }

                }

            }


            ProcessViewPanel.show();

        }

        return false;
    } // ProcessView


    // 只运行一个ReportPanel
    if (url.indexOf("/ReportSearch.jsp") != -1 || url.indexOf("/ReportGroupSearch.jsp") != -1) {
        var ReportIFrame = top.frames[ReportIFrameName];

        var ReportPanel = top.Ext.getCmp('centerTabPanel').findById(ReportPanelID);

        if (ReportIFrame == null || ReportPanel == null) {

            top.Ext.getCmp('centerTabPanel').add({
                xtype : 'panel',
                id : ReportPanelID,
                title : title,
                iconCls : 'tabs',
                html : '<iframe src="'
                    + encodeURI(url)
                    + '" id="'
                    + ReportIFrameName
                    + '" name="'
                    + ReportIFrameName
                    + '" align="middle" width="100%" height="100%" marginwidth="0" marginheight="0" frameborder="0" scrolling="no"></iframe>',
                closable : true
            }).show();

        }else{

            ReportIFrame.location = encodeURI(url);

            ReportPanel.setTitle(title);

            ReportPanel.show();

        }

        return false;

    }

    if (top.Ext.getCmp(name)) {
        top.Ext.getCmp(name).setTitle(title);
        top.Ext.getCmp(name).show();
        return false;
    }

    top.Ext.getCmp('centerTabPanel').add({
        id : name,
        title : title,
        iconCls : 'tabs',
        html : '<iframe src="'
            + encodeURI(url)
            + '" id="'
            + name
            + '" name="'
            + title
            + '" align="middle" width="100%" height="100%" marginwidth="0" marginheight="0" frameborder="0" scrolling="auto"></iframe>',
        closable : true
    }).show();

    return false;

}

function loadPageWithTarget(url,title,target,name){
    if (target == '_top') {

        top.location = url;

    } else if (target == '_blank') {

        window.open(url, '', 'toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');

    } else if (target == '_new') {

        window.open(url, '');

    } else {

        loadPage.call(top,url,title,name);

    }

    return false;

}
