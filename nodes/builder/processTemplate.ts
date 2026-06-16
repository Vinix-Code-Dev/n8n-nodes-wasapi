import { IDataObject } from "n8n-workflow";
import { TemplateEnum } from "../enum/template.enum";

// Process template variables
export function processTemplate(templateVars: IDataObject, baseData: IDataObject, dynamicVars: IDataObject): IDataObject {
	if (templateVars && Array.isArray(templateVars.template_vars)) {
	templateVars.template_vars.forEach((varItem: IDataObject) => {
		const varName = varItem.name as string;
		const varValue = varItem.value as string;

		if (!varName || !varValue) return;

		// Extract section from the name (e.g., "[Header] header_link" -> "Header")
		const sectionMatch = varName.match(/^\[(Header|Body|CTA|Footer)\]/);
		const section = sectionMatch?.[1] || null;
		// Remove the section prefix to get the actual variable name
		const actualVarName = varName.replace(/^\[(Header|Body|CTA|Footer)\] /, '');

		// Process based on section
		if (section === TemplateEnum.HEADER) {
			// Map header fields to specific API fields
			if (actualVarName === 'header_link') {
				baseData.url_file = varValue;
			} else if (/^header_.*_filename$/.test(actualVarName)) {
				baseData.file_name = varValue;
			} else {
				// Other header variables go to dynamic vars
				if (!dynamicVars.header_var) dynamicVars.header_var = [];
				(dynamicVars.header_var as IDataObject[]).push({
					text: actualVarName,
					val: varValue
				});
			}
		} else if (section === TemplateEnum.BODY) {
			// Body variables
			if (!dynamicVars.body_vars) dynamicVars.body_vars = [];
			(dynamicVars.body_vars as IDataObject[]).push({
				text: actualVarName.startsWith('VAR_') ? `{{${actualVarName.substring(4)}}}` : actualVarName,
				val: varValue
			});
		} else if (section === TemplateEnum.CTA) {
			// CTA variables
			if (!dynamicVars.cta_var) dynamicVars.cta_var = [];
			(dynamicVars.cta_var as IDataObject[]).push({
				text: actualVarName.startsWith('VAR_') ? `{{${actualVarName.substring(4)}}}` : actualVarName,
				val: varValue
			});
		} else if (section === TemplateEnum.FOOTER) {
			// Footer variables
			if (!dynamicVars.footer_var) dynamicVars.footer_var = [];
			(dynamicVars.footer_var as IDataObject[]).push({
				text: actualVarName.startsWith('VAR_') ? `{{${actualVarName.substring(4)}}}` : actualVarName,
				val: varValue
			});
		}
	});
}
return { ...baseData, ...dynamicVars };
}
