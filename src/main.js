import Ractive from 'ractive';
import template from './main.ract';
import request from 'then-request';

import issues from './components/issues.js';

const Main = new Ractive({
  el: 'root',
  template: template.template,
  components: {
    Issues: issues,
  },
  data: {
    activate: 0,
    loading: true,
    head: [
      'Open issues',
      'Closed issues'
    ],
    issue: []
  },
  oninit() {
    const self = this;
    function fetchIssue(query) {
      const url = `https://api.github.com/search/issues?per_page=100&q=+repo:atom%2Fatom${query}`;
      request('GET', url, { headers: { accept: 'application/json' } })
      .then((res) => {
        const data = JSON.parse(res.getBody());
        self.set('issue', data);
        self.set('loading', false);
        console.log(self.get('issue'));
      })
      .catch((err) => {
        alert(err);
        console.log(err);
        self.set('loading', false);
      });
    }

    switch(this.get('activate')) {
      case 0:
        this.set('loading', true);
        fetchIssue('+state:open');
        break;
      case 1:
        this.set('loading', true);
        fetchIssue('+state:closed');
        break;
    }
    this.on('active', (evt, i) => {
      this.set('activate', i);
      switch(this.get('activate')) {
        case 0:
          this.set('loading', true);
          this.set('issue', fetchIssue('+state:open'));
          break;
        case 1:
          this.set('loading', true);
          this.set('issue', fetchIssue('+state:closed'));
          break;
      }
    });
  }
});

export default Main;
