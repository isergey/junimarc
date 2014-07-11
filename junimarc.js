// Generated by CoffeeScript 1.7.1
(function() {
  var ControlField, DataField, DataSubfield, ExtendedSubfield, Field, Leader, Record, Subfield, junimarc,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Subfield = (function() {
    function Subfield(code) {
      this._code = code;
      this._parentField = null;
      this._index = '';
    }

    Subfield.prototype.getCode = function() {
      return this._code;
    };

    Subfield.prototype.setCode = function(code) {
      return this._code = code;
    };

    Subfield.prototype.setParentField = function(field) {
      return this._parentField = field;
    };

    Subfield.prototype.getParentField = function() {
      return this._parentField;
    };

    Subfield.prototype.setIndex = function(index) {
      return this._index = index;
    };

    Subfield.prototype.getIndex = function() {
      return this._index;
    };

    return Subfield;

  })();

  DataSubfield = (function(_super) {
    __extends(DataSubfield, _super);

    function DataSubfield(code, data) {
      DataSubfield.__super__.constructor.call(this, code);
      this._data = data;
    }

    DataSubfield.prototype.getData = function() {
      return this._data;
    };

    DataSubfield.prototype.setData = function(data) {
      return this._data = data;
    };

    DataSubfield.prototype.toString = function() {
      return "$" + (this.getCode()) + (this.getData());
    };

    DataSubfield.prototype.toDict = function() {
      return {
        'id': this.getCode(),
        'd': this.getData()
      };
    };

    DataSubfield.fromDict = function(dict) {
      var d, id;
      id = dict['id'];
      if (!id) {
        throw new Error('Data subfield not have id' + JSON.stringify(dict));
      }
      d = dict['d'];
      if (!d) {
        throw new Error('Data subfield not have id' + JSON.stringify(dict));
      }
      return new DataSubfield(id, d);
    };

    return DataSubfield;

  })(Subfield);

  ExtendedSubfield = (function(_super) {
    __extends(ExtendedSubfield, _super);

    function ExtendedSubfield(code) {
      ExtendedSubfield.__super__.constructor.call(this, code);
      this._fields = [];
    }

    ExtendedSubfield.prototype.addField = function(field) {
      field.setParentSubfield(this);
      return this._fields.push(field);
    };

    ExtendedSubfield.prototype.addFields = function(fields) {
      var field, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        _results.push(this.addField(field));
      }
      return _results;
    };

    ExtendedSubfield.prototype.getFields = function() {
      var field, index, _i, _len, _ref;
      index = 0;
      _ref = this._fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        field.setIndex("" + (this.getIndex()) + "_f_" + (field.getTag()) + "_" + index);
        index++;
      }
      return this._fields;
    };

    ExtendedSubfield.prototype.removeField = function(rfield) {
      var field, index, subfield, _i, _len, _ref, _results;
      index = this._fields.indexOf(rfield);
      if (index > -1) {
        return this._fields.splice(index, 1);
      } else {
        _ref = this.getFields();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          if (field instanceof DataField) {
            _results.push((function() {
              var _j, _len1, _ref1, _results1;
              _ref1 = field.getSubfields();
              _results1 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                subfield = _ref1[_j];
                if (subfield instanceof ExtendedSubfield) {
                  _results1.push(subfield.removeField(rfield));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    ExtendedSubfield.prototype.toString = function() {
      var field, fields, i, parts, _i, _len;
      parts = ["$" + (this.getCode()) + " \n\t   "];
      fields = this.getFields();
      i = 0;
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        parts.push(field.toString());
        if (i < fields.length - 1) {
          parts.push('\n\t   ');
        }
      }
      return parts.join('');
    };

    ExtendedSubfield.prototype.toDict = function() {
      var cfields, dfields, field, _i, _len, _ref;
      cfields = [];
      dfields = [];
      _ref = this.getFields();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field instanceof DataField) {
          dfields.push(field.toDict());
        } else {
          cfields.push(field.toDict());
        }
      }
      return {
        'id': this.getCode(),
        'cf': cfields,
        'df': dfields
      };
    };

    ExtendedSubfield.fromDict = function(dict) {
      var cf, cfs, df, dfs, esf, id, _i, _j, _len, _len1, _ref;
      id = dict['id'];
      if (!id) {
        throw new Error('Extended subfield not have id' + JSON.stringify(dict));
      }
      esf = new ExtendedSubfield(id);
      cfs = dict['cf'];
      if (!cfs) {
        throw new Error('Extended subfield not have cf' + JSON.stringify(dict));
      }
      _ref = dict['cf'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cf = _ref[_i];
        esf.addField(ControlField.fromDict(cf));
      }
      dfs = dict['df'];
      if (!dfs) {
        throw new Error('Extended subfield not have df' + JSON.stringify(dict));
      }
      for (_j = 0, _len1 = dfs.length; _j < _len1; _j++) {
        df = dfs[_j];
        esf.addField(DataField.fromDict(df));
      }
      return esf;
    };

    return ExtendedSubfield;

  })(Subfield);

  Field = (function() {
    function Field(tag) {
      this._tag = tag;
      this._parentSubfield = null;
      this._index = '';
    }

    Field.prototype.getTag = function() {
      return this._tag;
    };

    Field.prototype.setParentSubfield = function(subfield) {
      return this._parentSubfield = subfield;
    };

    Field.prototype.getParentSubfield = function() {
      return this._parentSubfield;
    };

    Field.prototype.setIndex = function(index) {
      return this._index = index;
    };

    Field.prototype.getIndex = function() {
      return this._index;
    };

    return Field;

  })();

  ControlField = (function(_super) {
    __extends(ControlField, _super);

    function ControlField(tag, data) {
      ControlField.__super__.constructor.call(this, tag);
      this._data = data;
    }

    ControlField.prototype.getData = function() {
      return this._data;
    };

    ControlField.prototype.toString = function() {
      return "" + (this.getTag()) + " " + (this.getData());
    };

    ControlField.prototype.toDict = function() {
      return {
        'tag': this.getTag(),
        'd': this.getData()
      };
    };

    ControlField.fromDict = function(dict) {
      var d, tag;
      tag = dict['tag'];
      if (!tag) {
        throw new Error('Control field not have tag ' + JSON.stringify(dict));
      }
      d = dict['d'];
      if (!d) {
        throw new Error('Control field not have d ' + JSON.stringify(dict));
      }
      return new ControlField(tag, d);
    };

    return ControlField;

  })(Field);

  DataField = (function(_super) {
    __extends(DataField, _super);

    function DataField(tag, ind1, ind2) {
      DataField.__super__.constructor.call(this, tag);
      this._ind1 = ind1;
      this._ind2 = ind2;
      this._subfields = [];
    }

    DataField.prototype.addSubfield = function(subfield) {
      subfield.setParentField(this);
      return this._subfields.push(subfield);
    };

    DataField.prototype.addSubfiels = function(subfields) {
      var subfield, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = subfields.length; _i < _len; _i++) {
        subfield = subfields[_i];
        subfield.setParentField(this);
        _results.push(this._subfields.push(subfield));
      }
      return _results;
    };

    DataField.prototype.getSubfields = function() {
      var index, subfield, _i, _len, _ref;
      index = 0;
      _ref = this._subfields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subfield = _ref[_i];
        subfield.setIndex("" + (this.getIndex()) + "_sf_" + (subfield.getCode()) + "_" + index);
        index++;
      }
      return this._subfields;
    };

    DataField.prototype.setSubfields = function(subfields) {
      this._subfields = [];
      return this.addSubfiels(subfields);
    };

    DataField.prototype.removeSubfield = function(rsubfield) {
      var index, subfield, _i, _len, _ref, _results;
      index = this._subfields.indexOf(rsubfield);
      if (index > -1) {
        return this._subfields.splice(index, 1);
      } else {
        _ref = this.getSubfields();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subfield = _ref[_i];
          if (subfield instanceof ExtendedSubfield) {
            _results.push(subfield.removeSubfield(rsubfield));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    DataField.prototype.getIndicator1 = function() {
      return this._ind1;
    };

    DataField.prototype.getIndicator2 = function() {
      return this._ind2;
    };

    DataField.prototype.toString = function() {
      var lines, subfield, _i, _len, _ref;
      lines = [this.getTag()];
      lines.push(' ');
      lines.push(this.getIndicator1().replace(' ', '#'));
      lines.push(this.getIndicator2().replace(' ', '#'));
      _ref = this.getSubfields();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subfield = _ref[_i];
        if (subfield instanceof DataSubfield) {
          lines.push(' ');
          lines.push(subfield.toString());
        } else {
          lines.push('\n\t');
          lines.push(subfield.toString());
        }
      }
      return lines.join('');
    };

    DataField.prototype.toDict = function() {
      var dsubfields, exsubfields, subfield, _i, _len, _ref;
      dsubfields = [];
      exsubfields = [];
      _ref = this.getSubfields();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subfield = _ref[_i];
        if (subfield instanceof DataSubfield) {
          dsubfields.push(subfield.toDict());
        } else {
          exsubfields.push(subfield.toDict());
        }
      }
      return {
        'tag': this.getTag(),
        'i1': this.getIndicator1(),
        'i2': this.getIndicator2(),
        'sf': dsubfields,
        'esf': exsubfields
      };
    };

    DataField.fromDict = function(dict) {
      var df, esf, esfs, i1, i2, sf, sfs, tag, _i, _j, _len, _len1;
      tag = dict['tag'];
      if (!tag) {
        throw new Error('Data field not have tag' + JSON.stringify(dict));
      }
      i1 = dict['i1'];
      if (!i1) {
        throw new Error('Data field not have i1' + JSON.stringify(dict));
      }
      i2 = dict['i2'];
      if (!i2) {
        throw new Error('Data field not have i2' + JSON.stringify(dict));
      }
      df = new DataField(tag, i1, i2);
      sfs = dict['sf'];
      if (!sfs) {
        throw new Error('Data field not have sfs' + JSON.stringify(dict));
      }
      for (_i = 0, _len = sfs.length; _i < _len; _i++) {
        sf = sfs[_i];
        df.addSubfield(DataSubfield.fromDict(sf));
      }
      esfs = dict['esf'];
      if (!esfs) {
        throw new Error('Data field not have esf ' + JSON.stringify(dict));
      }
      for (_j = 0, _len1 = esfs.length; _j < _len1; _j++) {
        esf = esfs[_j];
        df.addSubfield(ExtendedSubfield.fromDict(esf));
      }
      return df;
    };

    return DataField;

  })(Field);

  Leader = (function() {
    function Leader(data) {
      if (data == null) {
        data = '00000       00000       ';
      }
      this._data = data;
    }

    Leader.prototype.getData = function() {
      return this._data;
    };

    Leader.prototype.setData = function(data) {
      return this._data = data;
    };

    return Leader;

  })();

  Record = (function() {
    function Record() {
      this._leader = new Leader();
      this._fields = [];
    }

    Record.prototype.addField = function(field) {
      return this._fields.push(field);
    };

    Record.prototype.addFields = function(fields) {
      var field, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        _results.push(this.addField(field));
      }
      return _results;
    };

    Record.prototype.getFields = function() {
      var field, index, _i, _len, _ref;
      index = 0;
      _ref = this._fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        field.setIndex("f_" + (field.getTag()) + "_" + index);
        index++;
      }
      return this._fields;
    };

    Record.prototype.removeField = function(rfield) {
      var field, index, subfield, _i, _len, _ref, _results;
      index = this._fields.indexOf(rfield);
      if (index > -1) {
        return this._fields.splice(index, 1);
      } else {
        _ref = this.getFields();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          if (field instanceof DataField) {
            _results.push((function() {
              var _j, _len1, _ref1, _results1;
              _ref1 = field.getSubfields();
              _results1 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                subfield = _ref1[_j];
                if (subfield instanceof ExtendedSubfield) {
                  _results1.push(subfield.removeField(rfield));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Record.prototype.getLeader = function() {
      return this._leader;
    };

    Record.prototype.setLeader = function(leader) {
      return this._leader = leader;
    };

    Record.prototype.toString = function() {
      var field, parts, _i, _len, _ref;
      parts = ["ldr: " + (this.getLeader().getData())];
      _ref = this.getFields();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        parts.push(field.toString());
      }
      return parts.join('\n');
    };

    Record.prototype.toDict = function() {
      var cfields, dfields, field, _i, _len, _ref;
      cfields = [];
      dfields = [];
      _ref = this.getFields();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field instanceof DataField) {
          dfields.push(field.toDict());
        } else {
          cfields.push(field.toDict());
        }
      }
      return {
        'l': this.getLeader().getData(),
        'cf': cfields,
        'df': dfields
      };
    };

    Record.fromDict = function(dict) {
      var cf, cfs, df, dfs, leader, record, _i, _j, _len, _len1;
      record = new Record();
      leader = dict['l'];
      if (!leader) {
        throw new Error('Record not have leader');
      }
      record.setLeader(new Leader(leader));
      cfs = dict['cf'];
      if (!cfs) {
        throw new Error('Record not have cf');
      }
      for (_i = 0, _len = cfs.length; _i < _len; _i++) {
        cf = cfs[_i];
        record.addField(ControlField.fromDict(cf));
      }
      dfs = dict['df'];
      for (_j = 0, _len1 = dfs.length; _j < _len1; _j++) {
        df = dfs[_j];
        record.addField(DataField.fromDict(df));
      }
      return record;
    };

    return Record;

  })();

  junimarc = {
    Leader: Leader,
    Subfield: Subfield,
    DataSubfield: DataSubfield,
    ExtendedSubfield: ExtendedSubfield,
    Field: Field,
    ControlField: ControlField,
    DataField: DataField,
    Record: Record
  };

  return junimarc;

}).call(this);

//# sourceMappingURL=junimarc.map