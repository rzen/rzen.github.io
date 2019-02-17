Snackbar = {
	snackBar: null,

	init: function () {
		this.snackBar = document.createElement('div');
		this.snackBar.id = 'snackbar';
	},

	showSnackbar: function (text) {
		let sbEl = document.getElementById("snackbar");

		sbEl.className = 'show';
		sbEl.innerText = text;
		setTimeout(_ => sbEl.className = sbEl.className.replace('show', ''), 3000);
	}
}

document.addEventListener('load', Snackbar.init);