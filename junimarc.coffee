define([], ->
########################################################################################################################
  class Subfield
    constructor: (code) ->
      @_code = code
      @_parentField = null
      @_index = ''

    getCode: ->
      return @_code


    setCode: (code) ->
      @_code = code


    setParentField: (field) ->
      @_parentField = field


    getParentField: ->
      return @_parentField

    setIndex: (index) ->
      @_index = index

    getIndex: ->
      return @_index


  ########################################################################################################################
  class DataSubfield extends Subfield
    constructor: (code, data) ->
      super(code)
      @_data = data


    getData: ->
      return @_data


    setData: (data) ->
      @_data = data


    toString: ->
      return "$#{@getCode()}#{@getData()}"

    toDict: ->
      return {
      'id': @getCode(),
      'd': @getData()
      }

    @fromDict: (dict) ->
      id = dict['id']
      if not id
        throw new Error('Data subfield not have id' + JSON.stringify(dict))

      d = dict['d']
      if not d
        throw new Error('Data subfield not have id' + JSON.stringify(dict))

      return new DataSubfield(id, d)


  ########################################################################################################################
  class ExtendedSubfield extends Subfield
    constructor: (code) ->
      super(code)
      @_fields = []

    addField: (field) ->
      field.setParentSubfield(@)
      @_fields.push(field)

    addFields: (fields) ->
      for field in fields
        @addField(field)

    getFields: ->
      index = 0
      for field in @_fields
        field.setIndex("#{@getIndex()}_f_#{field.getTag()}_#{index}")
        index++

      return @_fields

    removeField: (rfield) ->
      index = @_fields.indexOf(rfield)
      if index > -1
        @_fields.splice(index, 1)
      else
        for field in @getFields()
          if field instanceof DataField
            for subfield in field.getSubfields()
              if subfield instanceof ExtendedSubfield
                subfield.removeField(rfield)

    toString: ->
      parts = ["$#{@getCode()} \n\t   "]
      fields = @getFields()
      i = 0
      for field in fields
        parts.push(field.toString())
        if i < fields.length - 1
          parts.push('\n\t   ')

      return parts.join('')

    toDict: ->
      cfields = []
      dfields = []
      for field in @getFields()
        if field instanceof DataField
          dfields.push(field.toDict())
        else
          cfields.push(field.toDict())
      return {
      'id': @getCode(),
      'cf': cfields,
      'df': dfields
      }

    @fromDict: (dict) ->
      id = dict['id']
      if not id
        throw new Error('Extended subfield not have id' + JSON.stringify(dict))

      esf = new ExtendedSubfield(id)

      cfs = dict['cf']
      if cfs
        for cf in dict['cf']
          esf.addField(ControlField.fromDict(cf))


      dfs = dict['df']
      if dfs
        for df in dfs
          esf.addField(DataField.fromDict(df))

      return esf

  ########################################################################################################################
  class Field
    constructor: (tag) ->
      @_tag = tag
      @_parentSubfield = null
      @_index = ''

    getTag: ->
      return @_tag


    setParentSubfield: (subfield) ->
      @_parentSubfield = subfield

    getParentSubfield: ->
      return @_parentSubfield

    setIndex: (index) ->
      @_index = index

    getIndex: ->
      return @_index

  ########################################################################################################################
  class ControlField extends Field
    constructor: (tag, data) ->
      super(tag)
      @_data = data

    getData: ->
      return @_data

    toString: ->
      return "#{@getTag()} #{@getData()}"

    toDict: ->
      return {'tag': @getTag(), 'd': @getData()}

    @fromDict: (dict) ->
      tag = dict['tag']
      if not tag
        throw new Error('Control field not have tag ' + JSON.stringify(dict))

      d = dict['d']
      if not d
        throw new Error('Control field not have d ' + JSON.stringify(dict))

      return new ControlField(tag, d)

  ########################################################################################################################
  class DataField extends Field
    constructor: (tag, ind1, ind2) ->
      super(tag)
      @_ind1 = ind1
      @_ind2 = ind2
      @_subfields = []


    addSubfield: (subfield) ->
      subfield.setParentField(@)
      @_subfields.push(subfield)


    addSubfiels: (subfields) ->
      for subfield in subfields
        subfield.setParentField(@)
        @_subfields.push(subfield)


    getSubfields: ->
      index = 0
      for subfield in @_subfields
        subfield.setIndex("#{@getIndex()}_sf_#{subfield.getCode()}_#{index}")
        index++

      return @_subfields


    setSubfields: (subfields) ->
      @_subfields = []
      @addSubfiels(subfields)

    removeSubfield: (rsubfield) ->
      index = @_subfields.indexOf(rsubfield)
      if index > -1
        @_subfields.splice(index, 1)
      else
        for subfield in @getSubfields()
          if subfield instanceof ExtendedSubfield
            subfield.removeSubfield(rsubfield)

    getIndicator1: ->
      return @_ind1


    getIndicator2: ->
      return @_ind2


    toString: ->
      lines = [@getTag()]
      lines.push(' ')
      lines.push(@getIndicator1().replace(' ', '#'))
      lines.push(@getIndicator2().replace(' ', '#'))

      for subfield in @getSubfields()
        if subfield instanceof DataSubfield
          lines.push(' ')
          lines.push(subfield.toString())
        else
          lines.push('\n\t')
          lines.push(subfield.toString())

      return lines.join('')

    toDict: ->
      dsubfields = []
      exsubfields = []

      for subfield in @getSubfields()
        if subfield instanceof DataSubfield
          dsubfields.push(subfield.toDict())
        else
          exsubfields.push(subfield.toDict())
      return {
      'tag': @getTag(),
      'i1': @getIndicator1(),
      'i2': @getIndicator2(),
      'sf': dsubfields,
      'esf': exsubfields
      }

    @fromDict: (dict) ->
      tag = dict['tag']
      if not tag
        throw new Error('Data field not have tag' + JSON.stringify(dict))

      i1 = dict['i1']
      if not i1
        throw new Error('Data field not have i1' + JSON.stringify(dict))

      i2 = dict['i2']
      if not i2
        throw new Error('Data field not have i2' + JSON.stringify(dict))

      df = new DataField(tag, i1, i2)

      sfs = dict['sf']
      if sfs
        for sf in sfs
          df.addSubfield(DataSubfield.fromDict(sf))

      esfs = dict['esf']
      if esfs
        for esf in esfs
          df.addSubfield(ExtendedSubfield.fromDict(esf))

      return df


  ########################################################################################################################
  class Leader
    constructor: (data = '00000       00000       ') ->
      @_data = data

    getData: ->
      return @_data

    setData: (data) ->
      @_data = data


  ########################################################################################################################
  class Record
    constructor: ->
      @_leader = new Leader()
      @_fields = []


    addField: (field) ->
      @_fields.push(field)

    addFields: (fields) ->
      for field in fields
        @addField(field)

    getFields: ->
      index = 0
      for field in @_fields
        field.setIndex("f_#{field.getTag()}_#{index}")
        index++
      return @_fields

    removeField: (rfield) ->
      index = @_fields.indexOf(rfield)
      if index > -1
        @_fields.splice(index, 1)

      else
        for field in @getFields()
          if field instanceof DataField
            for subfield in field.getSubfields()
              if subfield instanceof ExtendedSubfield
                subfield.removeField(rfield)

    getLeader: ->
      return @_leader

    setLeader: (leader) ->
      @_leader = leader


    toString: ->
      parts = ["ldr: #{@getLeader().getData()}"]
      for field in @getFields()
        parts.push(field.toString())

      return parts.join('\n')

    toDict: ->
      cfields = []
      dfields = []
      for field in @getFields()
        if field instanceof DataField
          dfields.push(field.toDict())
        else
          cfields.push(field.toDict())
      return {
      'l': @getLeader().getData(),
      'cf': cfields,
      'df': dfields
      }

    @fromDict: (dict) ->
      record = new Record()
      leader = dict['l']
      if not leader
        throw new Error('Record not have leader')

      record.setLeader(new Leader(leader))

      cfs = dict['cf']
      if not cfs
        throw new Error('Record not have cf')

      for cf in cfs
        record.addField(ControlField.fromDict(cf))

      dfs = dict['df']
      for df in dfs
        record.addField(DataField.fromDict(df))

      return record

  junimarc = {
    Leader: Leader,
    Subfield: Subfield,
    DataSubfield: DataSubfield,
    ExtendedSubfield: ExtendedSubfield,
    Field: Field,
    ControlField: ControlField,
    DataField: DataField,
    Record: Record
  }

  return junimarc
)
