let Utils = {
    joinPaths(files) {
        let hFinal = {};
        let hMain = {};
        let hTmp = {};
        files.forEach((file, index) => {
            let s = file.path.split("/");
            s[0] = "Root";
            if (file.hash) {
                s[s.length - 1] += `|${file.hash}|${file.size}|${file.uploadDate}|${file.mime}`;
            }
            hMain = JSON.parse(JSON.stringify(hFinal));
            hTmp = hMain;
            s.forEach(part => {
                if (typeof hTmp[part] === "undefined") {
                    hTmp[part] = {}
                }
                hTmp = hTmp[part];
            });
            hFinal = JSON.parse(JSON.stringify(hMain));
        });
        let aFinal = [];
        this.recursePaths(aFinal, hFinal);
        return aFinal;
    },
    recursePaths(aFinal, hCurrent, path = "") {
        let x = null;
        for (x in hCurrent) {
            let h = { label: x, children: [], path: path + x.split("|")[0] + "/" };
            this.recursePaths(h.children, hCurrent[x], h.path);
            let oldLabel = h.label;
            h.label = oldLabel.split("|")[0];
            h.treeId = this.generateUUID();
            if (h.children.length === 0) {
                if (h.label.includes(".")) {
                    h.hash = oldLabel.split("|")[1];
                    h.size = oldLabel.split("|")[2];
                    h.uploadDate = oldLabel.split("|")[3];
                    h.mime = oldLabel.split("|")[4];
                }
                delete h["children"];
            }
            aFinal.push(h);
        }

    },
    findPath(el) {
        let parents = [el.data.label];
        let path = '/';
        while (el.parent) {
            el = el.parent;
            if (el.parent){
                parents.push(el.data.label);
            }
        }
        parents.reverse().slice(1).forEach((parent, i) => {
            path += `${parent}/`
        });
        return path;
    },
    keepDirectoriesOnly(items, ids) {
        return items.filter(function f(o) {
            if (o.hasOwnProperty('size')) return false;
            if (ids.find( id => {
                return o.treeId === id
            })) {
                return false;
            }
            if (o.children) {
                return (o.children = o.children.filter(f));
            }
            return true;
        });
    },
    getFileExtension(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
    },
    findNodeWithHash(currentNode, hash) {
        let i,
            currentChild,
            result;
        if (hash == currentNode.hash) {
            return currentNode;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.children){
            for (i = 0; i < currentNode.children.length; i += 1) {
                currentChild = currentNode.children[i];
                // Search in the current child
                result = this.findNodeWithHash(currentChild, hash);
                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }}
            // The node has not been found and we have no more options
            return false;
        }
    },
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    },
    basename(path) {
        return path.replace(/\\/g,'/').replace( /.*\//, '' );
    },
    dirname(path) {
        return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '') || '/';
    },
    getRealPath(path){
        if (!path) return null;
        let ar = path.split('/')
        ar.shift();
        ar = ar.filter( it => { return it })
        if (this.getFileExtension(ar[length-1])){
            ar.pop();
        }
        return ar.join('/');
    },
    isValidFilename(fname) {
        let rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        let rg2 = /^[^.]/; // cannot start with dot (.)
        return rg1.test(fname) && rg2.test(fname);
    },
    formatBytes(a, b) {
        if (0 === a) return "0 Bytes";
        let c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    },
    timeConverter(UNIX_timestamp) {
        let a = new Date(UNIX_timestamp * 1000);
        return a.toLocaleString();
    },
    allowPreview(mime){
        return (mime === 'video/mp4'
        || mime === 'video/webm'
        || mime === 'video/ogg'
        || mime === 'audio/mpeg' || mime === 'audio/mp3'
        || mime === 'audio/ogg'
        || mime === 'audio/wav' || mime === 'audio/x-wav'
        || mime === 'image/gif'
        || mime === 'image/jpeg'
        || mime === 'image/png'
        || mime === 'image/svg+xml'
        || mime === 'application/pdf');
    },
    mimeToIcon(mime) {
        let categ = mime.split('/')[0];
        switch (categ) {
            case 'image':
                return 'fa fa-file-image-o';
            case 'audio':
                return 'fa fa-file-audio-o';
            case 'video':
                return 'fa fa-file-video-o';
            case 'text':
                return 'fa fa-file-text-o';
        }
        switch (mime) {
            case 'application/zip':
            case 'application/x-zip-compressed':
            case 'application/x-rar-compressed':
            case 'application/x-7z-compressed':
                return 'fa fa-file-archive-o';
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'fa fa-file-word-o';
            case 'application/pdf':
                return 'fa fa-file-pdf-o';
            default:
                return 'fa fa-file-o';
        }
    }
};

export default Utils;