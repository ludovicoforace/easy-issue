import Ractive from 'ractive';
import template from './issues.ract';

export default Ractive.extend({
  template: template.template,
  data: () => ({
    filter: ''
  }),
  computed: {
    filtered: function () {
      const title = this.get('issue').items.map(item => item.title);
      const filter = this.get('filter').toLowerCase();
      return title.filter(function (entry) {
        return !filter || entry.toString().toLowerCase().indexOf(filter) !== -1;
      });
    }
  },
  oninit() {
  }
});
