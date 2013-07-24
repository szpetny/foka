package foka.comparator;

import java.util.Comparator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommentComparator implements Comparator<String>{

	@Override
	public int compare(String comment1, String comment2) {
		if (comment1.equals(comment2)) {
			return 0;
		}
		
		
		int comm1 = matchNumber(comment1);
		int comm2 = matchNumber(comment2);
		if (comm1 < comm2) {
			return 1;
		}
		return -1;
	}

	private int matchNumber(String comment) {
		Pattern p = Pattern.compile("\\d+");
		Matcher m = p.matcher(comment);
		
		if(m.find()) {
			return Integer.parseInt(m.group());
		}
		return 0;
	}
}
