function in_range(a, b, c)
{
    var d = Math.abs(a);
    if (d >= (b - c) && d <= (b + c))
    {
        return true;
    }
    else
    {
        return false;
    }
}
function time_unit_format(a, b, c, d)
{
    if (a == 1)
    {
        return b + " ago";
    }
    else
    {
        var e = d;
        if (a < 20)
        {
            if (a >= 2 && a <= 4)
            {
                e = c;
            }
        }
        else
        {
            var f = a % 10;
            if (f >= 2 && f <= 4)
            {
                e = c;
            }
        }
        return a + " " + e + " ago";
    }
}
function format_seconds(a)
{
    return time_unit_format(a, 'second', 'seconds', 'seconds');
}
function format_minutes(a)
{
    return time_unit_format(a, 'minute', 'minutes', 'minutes');
}
function format_hours(a)
{
    return time_unit_format(a, 'hour', 'hours', 'hours');
}
function format_days(a)
{
    return time_unit_format(a, 'day', 'days', 'days');
}
function format_weeks(a)
{
    return time_unit_format(a, 'week', 'weeks', 'weeks');
}
function format_time_ago(a)
{

	var a = Math.round(new Date().getTime() / 1000)-a;
    var d = a;
    var b = 60;
    var c = 60 * b;
    var e = 24 * c;
    var f = Math.floor(d % 60);
    d /= 60;
    var g = Math.floor(d % 60);
    d /= 60;
    var h = Math.floor(d % 24);
    d /= 24;
    var i = Math.floor(d);
    d /= 7;
    var j = Math.round(d);
    if (a < 10)
    {
        return "a few seconds";
    }
    if (in_range(a, b / 2, 5))
    {
        return "half a minute ago";
    }
    if (in_range(a, b, 10))
    {
        return "a minute ago";
    }
    if (a < b)
    {
        return format_seconds(a);
    }
    if (in_range(a, 15 * b, b))
    {
        return "a quarter ago";
    }
    if (in_range(a, 30 * b, b))
    {
        return "half an hour ago";
    }
    if (in_range(a, c, 10 * b))
    {
        return "hour ago";
    }
    if (a < c)
    {
        return format_minutes(g);
    }
    if (a < e)
    {
        return format_hours(h);
    }
    if (a < 7 * e)
    {
        return format_days(i);
    }
    return format_weeks(j);
}