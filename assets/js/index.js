/** Bytes calculations */
const fileBase =  1000;
const fileUnits = { 
    tb: "TB", 
    gb: "GB", 
    mb: "MB", 
    kb: "KB", 
    b: "b" 
}

function getSize(size) {
    let selectedSize = 0;
    let selectedUnit = "b";

    if (size > 0) {
      let units = ['tb', 'gb', 'mb', 'kb', 'b'];

      for (let i = 0; i < units.length; i++) {
        let unit = units[i];
        let cutoff = Math.pow(fileBase, 4 - i) / 10;

        if (size >= cutoff) {
          selectedSize = size / Math.pow(fileBase, 4 - i);
          selectedUnit = unit;
          break;
        }
      }

      selectedSize = Math.round(10 * selectedSize) / 10;
    }

    return `${selectedSize} ${fileUnits[selectedUnit]}`;
}
/** Bytes calculations */
/** Time calculations */
function getMills(duration) {
    return duration.toFixed(2) + ' ms';
}
/** Time calculations */


/** Html templating */
//#region HTML GENERATORS
function getHtml(message, type){
    return `
        <div class="message">
            <div class="timestamp"> 
                <span class="badge badge-${ type == 'error' ? 'danger' : 'success' }">${ new Date().toLocaleString()} </span> 
            </div>
            <div class="body"> 
               <pre> <code class="json">${ message } </code> </pre>
            </div>
        </div>    
    `;    
}

function getIteration(elem){   
    return `
        <div class="args-test">    
            <div class="pt-2 pb-2 args-resulter">       
                ${elem.success == true ? '<i class="fas fa-check mr-2"></i>' : '<i class="fas fa-exclamation mr-2"></i>'}
                <span class="m"> "${getMills(elem.timeUsage)}" </span>                
            </div>

            <div> 
            ${elem.argsAttemption.length > 0 ?
              ` <hr/>
                <span class="args-comment">/* Arguments set */ </span>
                <pre class="args json">${JSON.stringify(elem.argsAttemption, null, 2)}</pre>
              ` : ''
            }
            </div>
        </div>
    `;
}

function getResult(data){
    const keys = Object.keys(data);
    let result = ``;
    
    keys.forEach((key, i) => {
        let inner = ``;

        data[key].forEach( elem => inner += getIteration(elem));
        result+= `
            <div>
                <span class="attempt"> Attempt №${i+1} </span>
                <div>
                    ${inner}
                </div>
            </div>
        `   
    });

    return result;
}

/** Items  */
function getModule(data){
    return `
        <div data-module="${data.module}" classs="module"
            id="module-${data.module}"
        >
            <h4> ${data.module}</h4>
            ${getSection(data)}
        <div>
        <hr/>
    `
}

function getSection(data){
    return `
        <div data-section="${data.section}" data-module="${data.module}" class="pl-5 section"
            id="section-${data.module}${data.section}"
        >
            <h5 class="section"> ${data.section} </h5>
            ${getItems(data)}
        <div>
    `
}

function getItems(data){
    console.log(data);
    let result = `<div>`;

    data.items.forEach(item => result += `
        <div data-section="${data.section}" data-module="${data.module}" data-item="${item.property}" class="pl-4 mb-3" 
            id="item-${data.module}${data.section}${item.property}"
        >
            <h6 class="item"> 
                <span>
                    <span class="widther mr-2">
                        <i class="fas fa-check mr-2 none"></i>
                        <i class="fas fa-exclamation mr-2 none"></i>
                    </span>

                    <span class="item-title"> ${item.title} </span>
                </span>

                <button type="button" class="btn btn-success btn-sm ml-3 runner"> Run </button>
                <button type="button" class="btn btn-primary btn-sm ml-3 results none" data-toggle="collapse" data-target="#${data.section}${data.module}${item.property}" aria-expanded="false" aria-controls="<%=sectionKey%><%=moduleKey%><%=itemKey%>"> 
                    Results
                </button>
            </h6>
            <div class="collapse" id="${data.section}${data.module}${item.property}">
                <div class="test-informationer">

                </div>
            </div>
        </div>`);
    
    return result+='</div>';
}
//#endregion HTML GENERATORS

/** Html templating */

class Item{


    constructor(dom){
        this.dom = dom;

        this.oncelyRunned = false;
        this.runner = this.dom.find('button.runner');
        this.resulter = this.dom.find('button.results')

        this.info = {
            moduleId : this.dom.data('module'),
            sectionId: this.dom.data('section'),
            itemId: this.dom.data('item')
        };

        this.icons = {
            sucs: this.dom.find('.fa-check'),
            error: this.dom.find('.fa-exclamation')
        }

        this.resultsDom = this.dom.find('.test-informationer');

        this.init();
    }

    get ids(){
        return this.info;
    }
      

    isSuccessfully(data){
        const keys = Object.keys(data);

        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            const itemSet = data[key];

            for(const item of itemSet){
                if(item.success === false){
                    return false;
                }                
            }
        }

        return true;
    }

    setLoading(bool){
        const action = bool === true ? 'addClass' : 'removeClass';
        this.runner[action]('loading');
    }

    setSuccess(bool){
        this.icons.error.addClass('none');
        this.icons.sucs.addClass('none');

        this.icons[ bool === true ? 'sucs' : 'error'].removeClass('none');
    }

    onTest(data){
        const sucs = this.isSuccessfully(data);

        this.resultsDom.empty();

        const result = $(getResult(data));      
        result.find('.args.json').each( (i, elem) => hljs.highlightBlock(elem));

        this.resultsDom.append(result);

        this.setSuccess(sucs);      

        this.runner.addClass('none');
        this.resulter.removeClass('none');        
    }

    onChange(data){       
        this.stash();
        this.dom.find('.item-title').text(data.title);
    }

    init(){
        this.runner.click(async e => await this.triggerTest());
    }

    async triggerTest(){
        this.setLoading(true);

        const { data } = await this.post();
       
        this.oncelyRunned = true;

        this.onTest(data);
        this.setLoading(false);
    }    


    triggerResult(){
        if(this.oncelyRunned === true){
            this.dom.find('.collapse').collapse('show');
        }
    }

    stash(){
        this.runner.removeClass('none');
        this.resulter.addClass('none');      
        this.icons.error.addClass('none');
        this.icons.sucs.addClass('none');
        
        this.dom.find('.collapse').collapse('hide');
        this.resultsDom.empty();
        this.oncelyRunned = false;
    }
    
    
    post(){
        return axios.post('/', this.info);
    }
}

class Composer{

    constructor(){
        this.content = $('#content');
        this.storage = {};
        this.io = io('http://localhost:8765');        

        this.stats = {
            cpu: $("#cpuPerc-origin"),
            mem: $("#memPerc-origin"),
            memUsage: $("#memUsage-origin")
        }

        this.terminal = $('.terminal');

        this.initListeners();
    }

    put(item){
        if(!this.storage[item.ids.moduleId]){
            this.storage[item.ids.moduleId] = {
                [item.ids.sectionId]: { [item.ids.itemId] : item }
            }
        }

        if(!this.storage[item.ids.moduleId][item.ids.sectionId]){
            this.storage[item.ids.moduleId][item.ids.sectionId] = { [item.ids.itemId] : item };
        }


        this.storage[item.ids.moduleId][item.ids.sectionId][item.ids.itemId] = item;
    }

    initListeners(){
        this.io.on('connection', socket => console.log("Connection was established"));
        this.io.on('disconnect', socket => console.log("Connection was lost"))

        /* Tests actions */
        this.io.on('test:new', payload => this.newTests(payload));
        this.io.on('test:changed', payload => this.changeTests(payload)); 
        this.io.on('test:deleted', payload => this.deleteTests(payload));

        /* Stats actions */
        this.io.on('stats:cpu', payload => this.setCpuStats(payload) );
        this.io.on('stats:mem', payload => this.setMemStats(payload));

        /* Console actions */
        this.io.on('console:log', payload => this.logMessage(payload) );
        this.io.on('console:error', payload => this.logError(payload));
    }



    logMessage(payload){
        this.log(payload, 'message');
    }

    logError(payload){
        this.log(payload, 'error');
    }

    log(payload, type){ 
        const elem = $(getHtml(payload, type));

        $('.terminal .empty').remove();
       
        this.terminal.append(elem);

        $(".terminal").scrollTop($(".terminal")[0].scrollHeight);
    }


    setCpuStats(payload){
       const perc = Math.round(payload * 10) / 10;
       this.stats.cpu.text(perc.toFixed(1));
    }

    setMemStats(payload){
        const usage = payload[0];
        const free = payload[1];

        const perc =  Math.round((usage/free * 100) * 10) / 10;
        this.stats.mem.text(perc.toFixed(1));
        this.stats.memUsage.text(`${getSize(usage)} / ${getSize(free)}`)
    }

    
    deleteTests(payload){
        const moduleId = payload.module;
        const sectionId = payload.section;

        payload.keys.forEach(e => {                    
            delete this.storage[moduleId][sectionId][e];
            $(`#item-${moduleId}${sectionId}${e}`).remove();

            if(this.isEmptyModule(moduleId)){
                delete this.storage[moduleId];
                $(`#module-${moduleId}`).remove();
            }

            if(this.isEmptySection(moduleId, sectionId)){    
                delete this.storage[moduleId][sectionId];
                $(`#section-${moduleId}${sectionId}`).remove();
            }
        });
        
    }

    
    newTests(payload){
        const moduleContainer = $(`#module-${payload.module}`);
        const sectionContainer= $(`#section-${payload.module}${payload.section}`);

        let appender;
        let dom;
        let exact = false;
   
        if(moduleContainer.length === 0){    

            dom = $(getModule(payload));
            this.content.append(dom);
        
        }else if(sectionContainer.length === 0){

            dom = $(getSection(payload));
            moduleContainer.append(dom);
        
        }else{

            dom = $(getItems(payload));
            exact = true;
            sectionContainer.append(dom);
        }       

        payload.items.forEach(item => {
            const itemDom = dom.find(`#item-${payload.module}${payload.section}${item.property}`);  
            this.put( new Item($(itemDom)) );     
        });
   
        
    }


    changeTests(payload){
        const moduleId = payload.module;
        const sectionId = payload.section;

        payload.items.forEach(item => this.storage[moduleId][sectionId][item.property].onChange(item));
    }


    isEmptyModule(moduleId){
        return Object.keys(this.storage[moduleId]).length == 0;
    }

    isEmptySection(moduleId, sectionId){
        return Object.keys(this.storage[moduleId][sectionId]).length == 0;
    }

    collectAllItems(){
        const result = [];

        Object.keys(this.storage).forEach( moduleId => {
            Object.keys(this.storage[moduleId]).forEach(sectionId => {
                Object.keys(this.storage[moduleId][sectionId]).forEach( itemId => {
                    result.push(this.storage[moduleId][sectionId][itemId]);
                })
            })
        });

        return result;
    }
}

$(e => {
    hljs.configure({
        languages: ['json']            // … other options aren't changed
    });
   const composer = new Composer();

   $('div[data-item]').each((i, dom) => composer.put( new Item($(dom)) ));

    $('#runAll').click( async e => {
        const allItems = composer.collectAllItems();
        for(const item of allItems){
            await item.triggerTest();
        }       
    });

    $('#viewResults').click(e => {
        const allItems = composer.collectAllItems();
        for(const item of allItems){
            item.triggerResult();
        }       
    });
})