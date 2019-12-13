# Dropdown Addon widget

## Description
This widget acts as an addon to a reference selector dropdown input control. It allows you to select multiple attributes from the referenced object and present them in the dropdown. The existing reference selector does not need to be altered or replaced.

## Usage
- Place the widget under a reference selector dropdown field. 
- Enter the properties:
  - ReferenceSelector Name: the Name of the reference selector that you want to attach to
  - Reference Entity: The entity that the reference selector points to.
  - Attributes: A list of placeholder variables for attributes that can be used in the Display String
  - Display String: The item text that is shown in the dropdown reference selector. This can be a combination of variables from the Attributes list where a variable can be referenced with ${variable name}. E.g. ${name} | ${address}

### Attributes
Multiple attributes can be used from the Reference Entity. Each attribute is represented by a Variable name. By opening the Attributes property, the variables can be managed. For DateTime and numeric attribute types, additional formatting can be applied per attribute on the Behavior tab. 

## Limitations
- Only plain text is supported in the Display String. Additional markup (HTML) is not supported
- The Reference Entity is only supported 1 level deep

