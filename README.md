# vuecookie

A Vue.js plugin for operating cookies tested up to ```Vue```

Install through npm

``` bash
npm install vuecookie --save
```

## Usage

The plugin is available through ```this.$cookie``` in Vue components

### For Example
``` javascript

this.$cookie.set('ym', 18, {expires: 1});

this.$cookie.get('ym');

this.$cookie.delete('ym');

this.$cookie.set('ym', 'One day later', { expires: 1 });
this.$cookie.set('ym', 'One year later', { expires: '1Y' });
this.$cookie.set('ym', 'One month later', { expires: '1M' });
this.$cookie.set('ym', 'One day later', { expires: '1D' });
this.$cookie.set('ym', 'One hour later', { expires: '1h' });
this.$cookie.set('ym', 'Ten minutes later', { expires: '10m' });
this.$cookie.set('ym', 'Thirty seconds later', { expires: '30s' });

```