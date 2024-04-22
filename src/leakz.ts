import { PassiveInput, SDK, Data } from '@caido/sdk-workflow';
import db from './db.json';
import { nopKinds, excludePatterns } from './config';

/**
 * Find potential leaks in a given string based on specified 'kind'.
 * 
 * @param {any} s - The string to search for potential leaks.
 * @param {any} kind - The category or 'kind' of patterns to use for the
 *                        search.
 * @returns {Promise<Array<Object>>} - An array of objects representing
 *                                     potential leaks found. Each object
 *                                     contains the pattern details and matched
 *                                     substrings.
 */
async function findLeaks(s: any, kind: any): Promise<Array<Object>> {
  var results = [];

  const patterns = db.hasOwnProperty(kind) ? db[kind] : false;
  if (!patterns) return results;

  for (const p of patterns) {
    const pattern = p.pattern;
    const re = new RegExp(pattern.regex);
    const matches = s.match(re);
    
    const ex = excludePatterns[kind];
    if (ex && ex.includes(pattern.name)) continue;
    if (!matches) continue;
    let result = pattern;

    result.matches = matches;
    results.push(result);
  }

  return results;
}

/**
 * Find (sensitive) fields that match any of the given strings.
 * 
 * @param {...any} s - The strings to search for field matches.
 * @returns {Promise<Array<string>>} - An array of strings representing fields
 *                                     that match the given strings.
 */
async function findFields(...s: any): Promise<Array<string>> {
  var results = [];

  const fields = db.field.fields;
  for (const field of fields) {
    for (const target of s) {
      const ex = excludePatterns.field;
      if (ex && ex.includes(field)) continue;
      if (!target) continue;

      const match = target.includes(field)
      if (match) results.push(field)
    }
  }

  return results
}

/**
 * @param {PassiveInput} input
 * @param {SDK} sdk
 * @returns {MaybePromise<Data | undefined>}
 */
export async function run(input: PassiveInput, sdk: SDK): Promise<Data | undefined> {
  const request = input.request;
  const response = input.response;

  if (request && response) {
    const body = response.getBody().toText();
    for (const kind in db) {
      let results = [];

      if (nopKinds && nopKinds.includes(kind)) continue;

      switch (kind) {
        case 'field':
          results = await findFields(
            request.getPath(), request.getQuery(), request.getHeader('').join(' '),
            request.getBody().toText(), response.getHeader('').toString(), body
          );
          break;
        default: // 'secret' or 'PII'
          sdk.console.log(kind)
          results = await findLeaks(body, kind);
          break;
      }

      for (const result of results) {
        let finding: any = {
          title: 'Found',
          reporter: 'Leakz',
          request: request
        };

        if (result.hasOwnProperty('matches')) { // kind: 'secret' or 'PII'
          finding.title += ` "${result.name}" ${kind}`
          finding.description = JSON.stringify({
            name: result.name,
            matches: result.matches,
            confidence: result.confidence
          });
        } else {
          finding.title += ` "${result}" sensitive ${kind}`
          finding.description = 'Request and/or response may contains sensitive' +
            ` "${result}" field.`;
        }

        await sdk.findings.create(finding);
      }
    }
  }

  return;
}
