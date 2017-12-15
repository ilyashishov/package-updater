const ipc = require('electron').ipcRenderer;
let dirName = '';
let packages = [];

$('#select-directory').on('click', () => {
	ipc.send('open-file-dialog');
})

ipc.on('selected-directory', (event, path) => {
	dirName = path;
  	$('#selected-file').html(`You selected: ${path}`);
})


function addItem() {
	let name = $('#input-package-name');

	if (name.val() === '') {
		name.addClass('error');

		setTimeout(() => {
			name.removeClass('error');
		}, 500);

		return false;
	}

	packages.push(name.val());

	let listItem = `
		<li class="list-group-item">
			<p>${name.val()}</p>
			<a href="#" class="del-btn">
				<span aria-hidden="true">&times;</span>
			</a>
		</li>
	`

	$('#packages-names').prepend(listItem);
	ipc.send('add-package-name', name.val());
	name.val('');
}

$('#add-package').on('click', () => {
	addItem()
})

$("#input-package-name").keypress( e => {
	if(e.keyCode === 13){
		addItem()
  	}
});

$('#packages-names').on('click', '.del-btn', function(){
	let elementIndex = packages.indexOf($(this).parent().find('p').text());
	packages.splice(elementIndex, 1);
	ipc.send('remove-package-name', $(this).parent().find('p').text());
	$(this).parent().remove();
});


function startUpdate() {
	if (dirName === '') {
		ipc.send('open-error-dialog-no-directory');
		return false;
	};

	if (packages.length < 1) {
		ipc.send('open-error-dialog-no-package');
		return false;
	};

	ipc.send('update-start');
}

$('#update').on('click', () => {
	startUpdate();
})

$("#input-package-name").keypress( e => {
	if(e.keyCode === 10){
		startUpdate();
  	}
});