import Ractive from 'ractive';
import template from './issues.ract';

export default Ractive.extend({
  template: template.template,
  data: () => ({
    filter: ''
  }),
  computed: {
    filtered: function () {
      const title = this.get('issue').items.map(item => ({
        title: item.title,
        url: item.html_url
      }));
      const filter = this.get('filter').toLowerCase();
      return title.filter(entry => !filter || entry.title.toString().toLowerCase().indexOf(filter) !== -1);
    }
  }
});
