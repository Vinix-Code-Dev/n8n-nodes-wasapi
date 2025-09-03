import { IExecuteFunctions } from "n8n-workflow";
import { WasapiClient } from "@laiyon/wasapi-sdk";

/**
 * Helper para validate the compatibility of flow and screen at runtime
 * Prevents 500 errors by invalid combinations
 */
export async function validateFlowCompatibility(
    this: IExecuteFunctions,
    client: WasapiClient,
    fromId: string,
    flowId: string,
    screen: string,
    itemIndex: number
): Promise<void> {

    // Validate that fromId is valid
    if (!fromId || fromId === '') {
        throw new Error('❌ WhatsApp Number (fromId) is required. Please select a valid WhatsApp number.');
    }

    // Validate that flowId is valid for the current fromId
    try {
        const flowsForPhone = await client.whatsapp.getFlowsByPhoneId(Number(fromId));
        const flowExists = flowsForPhone.some((flow: any) => flow.id.toString() === flowId);

        if (!flowExists) {
            throw new Error(
                `❌ The selected Flow ID "${flowId}" is not available for WhatsApp number "${fromId}". ` +
                `Please re-select a flow or save the node after changing the WhatsApp number.`
            );
        }
    } catch (flowValidationError: any) {
        throw new Error(`❌ Could not validate flow compatibility: ${flowValidationError.message}`);
    }

    // Validate that screen is valid for the current flowId
    try {
        const screensForFlow = await client.whatsapp.getFlowScreens({
            flow_id: flowId,
            phone_id: Number(fromId)
        });

        const screenExists = screensForFlow.some((s: any) => s.value === screen);

        if (!screenExists) {
            throw new Error(
                `❌ The selected Screen "${screen}" is not available for Flow "${flowId}" on WhatsApp number "${fromId}". ` +
                `Please re-select a screen or save the node after changing the flow.`
            );
        }
    } catch (screenValidationError: any) {
        throw new Error(`❌ Could not validate screen compatibility: ${screenValidationError.message}`);
    }

    // ✅ If all validations pass, do nothing
}
